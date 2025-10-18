import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get parameters from URL
    const title = searchParams.get('title') || 'Kyaw Zayar Tun'
    const description = searchParams.get('description') || 'Mobile Developer'
    const type = searchParams.get('type') || 'default' // default, blog, project

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '80px',
          }}
        >
          {/* Top Section - Logo/Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                background: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#667eea',
              }}
            >
              KZT
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                Kyaw Zayar Tun
              </div>
              <div
                style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Mobile Developer
              </div>
            </div>
          </div>

          {/* Middle Section - Title & Description */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              maxWidth: '90%',
            }}
          >
            {/* Type Badge */}
            {type !== 'default' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  fontSize: '18px',
                  color: 'white',
                  width: 'fit-content',
                }}
              >
                {type === 'blog' ? '📝 Blog Post' : '🚀 Project'}
              </div>
            )}

            {/* Title */}
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: '32px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.4,
                }}
              >
                {description}
              </div>
            )}
          </div>

          {/* Bottom Section - Website */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                background: 'white',
                borderRadius: '50%',
              }}
            />
            kyawzayartun.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
