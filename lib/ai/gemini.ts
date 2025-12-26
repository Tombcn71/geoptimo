import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY || '',
})

export async function runPromptOnGemini(prompt: string) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.warn('Google AI API key not configured')
    return null
  }

  try {
    const model = 'gemini-flash-lite-latest'
    
    // System instruction matching Google AI Overview style
    const systemInstruction = `Eres el asistente de AI Overview de Google. Responde EXACTAMENTE como la función AI Overview de Google en los resultados de búsqueda.

REGLAS CRÍTICAS (Coincidir con el AI Overview real de Google):
- Responde con la MISMA LONGITUD y DETALLE que muestra el AI Overview real de Google
- Responde la pregunta directamente y de manera integral
- Usa formato markdown: **negrita** para marcas/términos clave, viñetas para listas
- Incluye contexto relevante y explicaciones
- Sé útil e informativo como los resultados reales de Google
- Tono conversacional natural

EJEMPLOS DE ESTILO del AI Overview real de Google:
- Respuesta directa en la apertura
- 2-5 párrafos con estructura adecuada
- Viñetas al enumerar opciones/características
- Texto en negrita para énfasis en marcas/productos
- Información práctica y accionable

Responde como los usuarios verían en la Búsqueda real de Google: integral pero enfocado.`

    const contents = [
      {
        role: 'user' as const,
        parts: [
          {
            text: `${systemInstruction}\n\nUser question: ${prompt}`,
          },
        ],
      },
    ]

    const config = {
      maxOutputTokens: 800, // Allow full Google AI Overview length (~400-600 words)
      temperature: 0.7,
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    })

    return {
      response: response.text,
      provider: 'Gemini',
      mentioned: false, // Will be analyzed
      position: null,
      sentiment: null,
    }
  } catch (error) {
    console.error('Google AI API error:', error)
    return null
  }
}

export async function analyzeBrandMention(response: string, brandName: string) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return {
      mentioned: response.toLowerCase().includes(brandName.toLowerCase()),
      position: null,
      sentiment: 'neutral'
    }
  }

  try {
    const model = 'gemini-flash-lite-latest'
    
    const prompt = `Analiza esta respuesta de IA para menciones de "${brandName}":

${response}

Devuelve SOLO JSON válido con esta estructura exacta:
{
  "mentioned": true o false,
  "position": número del 1-10 o null,
  "sentiment": "positive" o "neutral" o "negative",
  "snippet": "cita del texto" o null
}

No incluyas ningún otro texto, solo el JSON.`

    const contents = [
      {
        role: 'user' as const,
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ]

    const result = await ai.models.generateContent({
      model,
      contents,
    })
    
    const analysisText = result.text
    
    // Clean up the response to extract JSON
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        mentioned: parsed.mentioned || false,
        position: parsed.position || null,
        sentiment: parsed.sentiment || 'neutral',
        snippet: parsed.snippet || null
      }
    }

    return {
      mentioned: response.toLowerCase().includes(brandName.toLowerCase()),
      position: null,
      sentiment: 'neutral'
    }
  } catch (error) {
    console.error('Brand mention analysis error:', error)
    return {
      mentioned: response.toLowerCase().includes(brandName.toLowerCase()),
      position: null,
      sentiment: 'neutral'
    }
  }
}

export async function analyzeContentWithGemini(content: string) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error('GOOGLE_AI_API_KEY not configured')
  }

  try {
    const model = 'gemini-flash-lite-latest'
    
    const prompt = `Eres un experto en GEO (Optimización de Motores Generativos).

PASO 1: Primero determina el TIPO DE CONTENIDO:
- Página de Producto/Servicio (e-commerce, SaaS, servicios, apps)
- Contenido Informativo (blog, guía, tutorial, artículo)
- Página de Negocio (sobre nosotros, contacto, equipo)

PASO 2: Da puntuaciones (0-100) adaptadas al tipo de contenido:

Para páginas de PRODUCTO/SERVICIO (como apps, servicios):
- citationLikelihood: Enfócate en autoridad de marca, claridad de USP, prueba social (70-90 esperado)
- readability: Claridad de descripción del producto y beneficios (70-95 esperado)
- structure: Flujo lógico del producto - problema → solución → acción (65-90 esperado)
- entityCoverage: Características del producto, casos de uso, descripción de audiencia objetivo (60-85 esperado)
- factualDensity: Especificaciones concretas, precios, resultados, ejemplos (50-80 esperado)
- sourceQuality: Reseñas, testimonios, casos de estudio, prueba social (40-75 esperado)

Para contenido INFORMATIVO:
- citationLikelihood: Autoridad experta, citación de fuentes, profundidad (60-95 esperado)
- readability: Complejidad del texto para audiencia amplia (70-95 esperado)
- structure: Jerarquía y organización del contenido (70-95 esperado)
- entityCoverage: Conceptos, definiciones, terminología (65-90 esperado)
- factualDensity: Hechos, datos, estadísticas (60-90 esperado)
- sourceQuality: Fuentes externas y referencias (50-85 esperado)

PASO 3: Da 3-5 sugerencias ÚNICAS y DIFERENTES específicas para el tipo de contenido. ¡SIN DUPLICADOS! ¡TODO EN ESPAÑOL!

Devuelve SOLO JSON válido (sin markdown, sin texto extra):
{
  "contentType": "product|informative|business",
  "citationLikelihood": 85,
  "readability": 80,
  "structure": 90,
  "entityCoverage": 75,
  "factualDensity": 80,
  "sourceQuality": 85,
  "suggestions": [
    {"type": "high", "category": "USP", "message": "Consejo único 1 en español", "impact": "+10"},
    {"type": "medium", "category": "Trust", "message": "Consejo único 2 en español", "impact": "+5"},
    {"type": "low", "category": "SEO", "message": "Consejo único 3 en español", "impact": "+3"}
  ]
}

Contenido a analizar:
${content.substring(0, 4000)}`

    const contents = [
      {
        role: 'user' as const,
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ]

    const config = {
      responseModalities: ['TEXT' as const],
    }

    const result = await ai.models.generateContent({
      model,
      contents,
      config,
    })
    
    const analysisText = result.text
    
    console.log('Gemini raw response:', analysisText)
    
    // Extract JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      
      // Validate required fields
      if (!parsed.citationLikelihood || !parsed.readability || !parsed.structure) {
        throw new Error('Gemini returned incomplete data')
      }
      
      return parsed
    }

    throw new Error('Gemini returned invalid JSON format')
  } catch (error) {
    console.error('Gemini content analysis error:', error)
    throw error
  }
}

// NEW: Detect ALL brands/competitors in AI response
export async function detectAllBrands(response: string, yourBrandName: string) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return {
      yourBrand: { mentioned: false, position: null, sentiment: 'neutral' },
      competitors: []
    }
  }

  try {
    const model = 'gemini-flash-lite-latest'
    
    const prompt = `Eres un experto en detección de marcas. Extrae TODOS los nombres de empresas y productos de esta respuesta de IA.

Tu Marca (como referencia): "${yourBrandName}"

Respuesta de IA a analizar:
"""
${response}
"""

INSTRUCCIONES CRÍTICAS:
1. Encuentra CADA nombre de marca/empresa/producto mencionado EN CUALQUIER LUGAR del texto
2. Busca:
   - Nombres de empresas (Asana, Trello, Monday.com, HeadshotPro)
   - Nombres de productos (Photoshop, Lightroom, Aragon AI)
   - Nombres de software/servicios (incluso con espacios: "Aragon AI", "Topaz Photo AI")
   - Tanto en listas numeradas COMO en texto corrido
3. EXCLUYE términos genéricos: "software", "herramienta", "fotógrafo", "cámara", "app" (sin marca)
4. INCLUYE herramientas con marca específica: "Adobe Photoshop", "Canva Pro", "Remove.bg"
5. Extrae la posición del contexto (si se menciona como #1, #2, primero, segundo, etc.)
6. Determina el sentimiento del texto circundante (pros/recomendado = positivo, contras/problemas = negativo)

Ejemplos de lo que SÍ extraer:
✅ "Aragon AI" (nombre de marca)
✅ "HeadshotPro" (nombre de servicio)  
✅ "Monday.com" (empresa)
✅ "Adobe Lightroom" (producto)
✅ "Topaz Gigapixel AI" (software)

Ejemplos de lo que NO extraer:
❌ "software" (genérico)
❌ "fotógrafo" (profesión)
❌ "IA" (tecnología)
❌ "headshot" (término genérico)

Devuelve SOLO esta estructura JSON (sin markdown, sin explicación):
{
  "yourBrand": {
    "mentioned": true/false,
    "position": número o null,
    "sentiment": "positive"/"neutral"/"negative"
  },
  "competitors": [
    {
      "name": "Nombre Exacto de la Marca",
      "position": número o null,
      "sentiment": "positive"/"neutral"/"negative"
    }
  ]
}

IMPORTANTE: NO incluyas "${yourBrandName}" en el array de competidores. Extrae TODAS las demás marcas exhaustivamente.`

    const contents = [
      {
        role: 'user' as const,
        parts: [{ text: prompt }]
      }
    ]

    const result = await ai.models.generateContent({
      model,
      contents,
    })
    
    const analysisText = result.text?.trim()
    
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      const competitors = Array.isArray(parsed.competitors) ? parsed.competitors.filter((c: any) => 
        c.name && c.name.toLowerCase() !== yourBrandName.toLowerCase()
      ) : []
      
      // Debug logging
      console.log(`🔍 Brand Detection Results:`)
      console.log(`   Your Brand (${yourBrandName}): ${parsed.yourBrand?.mentioned ? 'MENTIONED' : 'NOT mentioned'}`)
      console.log(`   Competitors found: ${competitors.length}`)
      competitors.forEach((c: any) => {
        console.log(`      - ${c.name} (position: ${c.position || 'none'}, sentiment: ${c.sentiment})`)
      })
      
      return {
        yourBrand: parsed.yourBrand || { mentioned: false, position: null, sentiment: 'neutral' },
        competitors
      }
    }

    // Fallback
    return {
      yourBrand: { 
        mentioned: response.toLowerCase().includes(yourBrandName.toLowerCase()),
        position: null, 
        sentiment: 'neutral' 
      },
      competitors: []
    }
  } catch (error) {
    console.error('Error detecting brands:', error)
    
    // Fallback
    return {
      yourBrand: { 
        mentioned: response.toLowerCase().includes(yourBrandName.toLowerCase()),
        position: null, 
        sentiment: 'neutral' 
      },
      competitors: []
    }
  }
}
