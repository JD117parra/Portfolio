import qrcode
from PIL import Image

# Configurar el código QR
qr = qrcode.QRCode(
    version=2,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)

# Agregar el link
url = "https://jd117parra.github.io/Portfolio/profile.html"
qr.add_data(url)
qr.make(fit=True)

# Personalizar colores: Morado sutil en los cuadros y un fondo gris oscuro
img = qr.make_image(fill_color="#8A2BE2", back_color="#1C1C1C")  # Morado (BlueViolet) sobre gris oscuro

# Guardar el QR
img.save("codigo_qr_morado.png")