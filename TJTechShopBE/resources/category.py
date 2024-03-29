from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from models.category import CategoryModel
from resources.db import db
from schemas import PlainCategorySchema, CategorySchema

blp = Blueprint("CategoryModel", __name__, description="Operations on category")


@blp.route("/category")
class Category(MethodView):

    @blp.response(200, CategorySchema(many=True))
    def get(self):
        return CategoryModel.query.all()

    @blp.arguments(PlainCategorySchema)
    @blp.response(201, CategorySchema)
    def post(self, category_data):
        category = CategoryModel(**category_data)
        try:
            db.session.add(category)
            db.session.commit()
        except SQLAlchemyError as e:
            return e

        return category


@blp.route("/category/<string:name>")
class CategoryExt(MethodView):

    @blp.response(200, CategorySchema)
    def get(self, name):
        category = CategoryModel.query.filter(CategoryModel.name == name).first()
        if not category:
            abort(404,
                  message=f"No category found with the name: {name}")
        else:
            return category

    @blp.arguments(PlainCategorySchema)
    @blp.response(201, CategorySchema)
    def put(self, category_data, name):
        try:
            category = CategoryModel.query.filter(CategoryModel.name == name).first()
            if not category:
                abort(404,
                      message=f"No category exists with the name: {name}")
            else:
                category.name = category_data["name"]
                category.image_id = category_data["image_id"]
            db.session.add(category)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,
                  message=f"Category name, {category_data['name']}, already exists")

        return category

    @blp.response(200)
    def delete(self, name):
        category = CategoryModel.query.filter(CategoryModel.name == name).first()
        if not category:
            abort(404,
                  message=f"No category exists with the name: {name}")
        else:
            db.session.delete(category)
            db.session.commit()
            return {"message": f"{name} category has been deleted.", "status": 200}


@blp.route("/category/id/<int:category_id>")
class CategoryId(MethodView):

    @blp.response(200, CategorySchema)
    def get(self, category_id):
        category = CategoryModel.query.get_or_404(category_id,
                                                  description=f"No category exists with the id: {category_id}")
        return category
