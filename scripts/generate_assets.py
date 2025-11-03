#!/usr/bin/env python3
"""
Generate placeholder sprite sheets for Matilda (badger character)
Creates simple colored rectangles as placeholders for Minecraft-style sprites
"""
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("PIL not installed. Install with: pip install Pillow")
    exit(1)

OUTPUT_DIR = Path(__file__).parent.parent / "assets" / "images"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Minecraft-style color palette for badger
BADGER_COLORS = {
    'body': '#2C2C2C',      # Dark gray
    'stripe': '#FFFFFF',     # White stripe
    'accent': '#4A4A4A',     # Light gray
    'outline': '#000000',    # Black outline
}

BLOCK_COLOR = '#8B4513'  # Brown (dirt)
GRASS_COLOR = '#7CFC00'  # Green (grass)
STONE_COLOR = '#808080'  # Gray (stone)

def create_badger_sprite(width=32, height=32, direction='right'):
    """Create a simple badger sprite"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Body
    draw.rectangle([8, 12, 24, 26], fill=BADGER_COLORS['body'])
    
    # White stripe on face
    draw.rectangle([6, 14, 14, 20], fill=BADGER_COLORS['stripe'])
    
    # Head
    draw.ellipse([4, 10, 16, 22], fill=BADGER_COLORS['body'])
    
    # Eyes
    eye_x = 10 if direction == 'right' else 8
    draw.rectangle([eye_x, 14, eye_x+2, 16], fill='#FFFFFF')
    
    # Legs (simplified)
    draw.rectangle([10, 24, 12, 28], fill=BADGER_COLORS['accent'])
    draw.rectangle([18, 24, 20, 28], fill=BADGER_COLORS['accent'])
    
    return img

def create_spritesheet():
    """Create sprite sheet with 4 animation frames"""
    frame_width, frame_height = 32, 32
    frames = 4
    
    # Right movement
    sheet_right = Image.new('RGBA', (frame_width * frames, frame_height), (0, 0, 0, 0))
    for i in range(frames):
        sprite = create_badger_sprite(frame_width, frame_height, 'right')
        # Simple animation by shifting legs
        if i % 2 == 1:
            draw = ImageDraw.Draw(sprite)
            draw.rectangle([12, 24, 14, 28], fill=BADGER_COLORS['accent'])
            draw.rectangle([16, 24, 18, 28], fill=BADGER_COLORS['accent'])
        sheet_right.paste(sprite, (i * frame_width, 0))
    sheet_right.save(OUTPUT_DIR / "matilda_right.png")
    
    # Left movement (flip)
    sheet_left = sheet_right.transpose(Image.FLIP_LEFT_RIGHT)
    sheet_left.save(OUTPUT_DIR / "matilda_left.png")
    
    # Idle
    idle = create_badger_sprite()
    idle.save(OUTPUT_DIR / "matilda_idle.png")
    
    # Jump
    jump = create_badger_sprite()
    # Slightly modify for jump pose
    jump.save(OUTPUT_DIR / "matilda_jump.png")
    
    print("✓ Created Matilda sprites")

def create_block_textures():
    """Create Minecraft-style block textures"""
    size = 32
    
    # Dirt block
    dirt = Image.new('RGB', (size, size), BLOCK_COLOR)
    draw = ImageDraw.Draw(dirt)
    for _ in range(10):
        import random
        x, y = random.randint(0, size-2), random.randint(0, size-2)
        darker = tuple(max(0, c - 20) for c in Image.new('RGB', (1,1), BLOCK_COLOR).getpixel((0,0)))
        draw.point((x, y), fill=darker)
    dirt.save(OUTPUT_DIR / "block_dirt.png")
    
    # Grass block
    grass = Image.new('RGB', (size, size), BLOCK_COLOR)
    draw = ImageDraw.Draw(grass)
    draw.rectangle([0, 0, size, 6], fill=GRASS_COLOR)
    grass.save(OUTPUT_DIR / "block_grass.png")
    
    # Stone block
    stone = Image.new('RGB', (size, size), STONE_COLOR)
    stone.save(OUTPUT_DIR / "block_stone.png")
    
    print("✓ Created block textures")

def create_background():
    """Create simple background"""
    bg = Image.new('RGB', (800, 600), '#87CEEB')  # Sky blue
    draw = ImageDraw.Draw(bg)
    # Simple clouds
    draw.ellipse([100, 50, 200, 100], fill='#FFFFFF')
    draw.ellipse([400, 80, 500, 130], fill='#FFFFFF')
    bg.save(OUTPUT_DIR.parent / "backgrounds" / "sky.png")
    
    print("✓ Created background")

if __name__ == "__main__":
    print("Generating game assets...")
    create_spritesheet()
    create_block_textures()
    create_background()
    print("\nAll assets generated successfully!")
