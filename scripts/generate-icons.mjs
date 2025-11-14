import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function generateIcons() {
  const publicDir = join(__dirname, '..', 'public')

  try {
    // Try to use sharp
    const sharpModule = await import('sharp').catch(() => null)

    if (sharpModule?.default) {
      const sharp = sharpModule.default

      // Generate 192x192 icon (black square with white border for visibility)
      const icon192 = sharp({
        create: {
          width: 192,
          height: 192,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 1 },
        },
      })
      await icon192.png().toFile(join(publicDir, 'icon-192.png'))

      // Generate 512x512 icon
      const icon512 = sharp({
        create: {
          width: 512,
          height: 512,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 1 },
        },
      })
      await icon512.png().toFile(join(publicDir, 'icon-512.png'))

      console.log('Icons generated successfully using sharp')
      return
    }
  } catch (e) {
    // sharp not available, continue to install
  }

  // Fallback: Install sharp and try again
  console.log('Installing sharp as dev dependency...')
  try {
    execSync('pnpm add -D sharp', {
      cwd: join(__dirname, '..'),
      stdio: 'inherit',
    })

    // Retry with sharp
    const sharpModule = await import('sharp')
    const sharp = sharpModule.default

    const icon192 = sharp({
      create: {
        width: 192,
        height: 192,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      },
    })
    await icon192.png().toFile(join(publicDir, 'icon-192.png'))

    const icon512 = sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      },
    })
    await icon512.png().toFile(join(publicDir, 'icon-512.png'))

    console.log('Icons generated successfully')
  } catch (error) {
    console.error('Failed to generate icons:', error.message)
    console.error('Please install sharp manually: pnpm add -D sharp')
    process.exit(1)
  }
}

generateIcons().catch(console.error)
