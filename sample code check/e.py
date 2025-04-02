from flask_bcrypt import Bcrypt


bycrpt = Bcrypt()

password = "12345678"
hash = "$2b$12$TLwbAX.wpJPR9m.0ZL7VmuUFq6C3D0jIUsws33bFjCk.9WbMxPn2K"
f = bycrpt.check_password_hash(hash, password)
print(f)