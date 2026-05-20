import os
from PIL import Image, ImageDraw

def create_fallback_icon(size):
    # Dark rounded square + white triangle
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Rounded square params
    margin = size // 10
    radius = size // 5
    color = (40, 40, 40, 255) # Dark gray/black
    
    # Draw rounded rect
    draw.rounded_rectangle([margin, margin, size - margin, size - margin], radius=radius, fill=color)
    
    # Draw white triangle
    # Points: left-center, top-right, bottom-right
    t_margin = size // 4
    points = [
        (t_margin, size // 2),
        (size - t_margin, t_margin),
        (size - t_margin, size - t_margin)
    ]
    draw.polygon(points, fill=(255, 255, 255, 255))
    
    return img

def main():
    svg_path = 'public/favicon.svg'
    output_dir = 'public'
    
    try:
        # Pillow does not support SVG by default. 
        # Checking if it works (usually doesn't without extra plugins)
        base_img = Image.open(svg_path)
        print(f"Successfully opened {svg_path} with Pillow (unexpectedly)")
    except Exception as e:
        print(f"Direct SVG open failed: {e}. Using fallback drawing.")
        base_img = None

    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512,
    }

    generated_images = {}

    for name, size in sizes.items():
        if base_img:
            img = base_img.resize((size, size), Image.Resampling.LANCZOS)
        else:
            img = create_fallback_icon(size)
        
        path = os.path.join(output_dir, name)
        img.save(path)
        generated_images[size] = img
        print(f"Created: {path} ({size}x{size})")

    # Save favicon.ico
    ico_path = os.path.join(output_dir, 'favicon.ico')
    ico_imgs = [generated_images[16], generated_images[32]]
    ico_imgs[0].save(ico_path, format='ICO', sizes=[(16,16), (32,32)])
    print(f"Created: {ico_path} (16x16, 32x32)")

if __name__ == "__main__":
    main()
