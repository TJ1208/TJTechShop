from resources.db import db


class CategoryModel(db.Model):
    __tablename__ = "category"

    category_id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    image_id = db.Column(db.BigInteger, db.ForeignKey("image.image_id",  ondelete="CASCADE"), unique=False, nullable=True, default=0)
    image = db.relationship("ImageModel", backref="image", cascade="all, delete", lazy=True)
    sub_categories = db.relationship("SubCategoryModel", backref="sub_categories")
