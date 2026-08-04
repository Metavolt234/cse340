import {
getAllCategories,
getCategoryById,
getProjectsByCategory,
createCategory,
updateCategory
} from "../models/categories.js";

/**

* Display all categories
  */
  const buildCategoryList = async (req, res) => {

  try {

  ```
   const categories = await getAllCategories();

   res.render("categories", {
       title: "Categories",
       categories
   });
  ```

  } catch (error) {

  ```
   console.error("Error loading categories:", error);

   res.status(500).render("500", {
       title: "500 - Server Error"
   });
  ```

  }

};

/**

* Display category details
  */
  const buildCategoryDetail = async (req, res) => {

  try {

  ```
   const categoryId = req.params.id;

   const category = await getCategoryById(categoryId);

   if (!category) {

       return res.status(404).render("404", {
           title: "Category Not Found"
       });

   }

   const projects = await getProjectsByCategory(categoryId);

   res.render("category-details", {
       title: category.name,
       category,
       projects
   });
  ```

  } catch (error) {

  ```
   console.error("Error loading category details:", error);

   res.status(500).render("500", {
       title: "500 - Server Error"
   });
  ```

  }

};

/**

* Build Create Category View
  */
  const buildNewCategory = (req, res) => {

  res.render("new-category", {
  title: "Create Category",
  errors: [],
  categoryName: ""
  });

};

/**

* Save Category
  */
  const addCategory = async (req, res) => {

  const { categoryName } = req.body;

  const cleanCategoryName = categoryName
  ? categoryName.trim()
  : "";

  // Validate category name
  if (
  !cleanCategoryName ||
  cleanCategoryName.length < 3 ||
  cleanCategoryName.length > 100
  ) {

  ```
   return res.render("new-category", {

       title: "Create Category",

       errors: [
           {
               msg: "Category name must be between 3 and 100 characters."
           }
       ],

       categoryName: cleanCategoryName

   });
  ```

  }

  try {

  ```
   await createCategory(cleanCategoryName);


   // Success flash message
   if (req.flash) {

       req.flash(
           "success",
           "Category created successfully."
       );

   }


   res.redirect("/categories");
  ```

  } catch (error) {

  ```
   console.error("Error creating category:", error);


   // Duplicate category
   if (error.code === "23505") {

       return res.render("new-category", {

           title: "Create Category",

           errors: [
               {
                   msg: "A category with this name already exists."
               }
           ],

           categoryName: cleanCategoryName

       });

   }


   res.status(500).render("500", {
       title: "500 - Server Error"
   });
  ```

  }

};

/**

* Build Edit Category View
  */
  const buildEditCategory = async (req, res) => {

  try {

  ```
   const category = await getCategoryById(req.params.id);


   if (!category) {

       return res.status(404).render("404", {
           title: "Category Not Found"
       });

   }


   res.render("edit-category", {

       title: "Edit Category",

       errors: [],

       category

   });
  ```

  } catch (error) {

  ```
   console.error("Error loading edit category page:", error);

   res.status(500).render("500", {
       title: "500 - Server Error"
   });
  ```

  }

};

/**

* Update Category
  */
  const editCategory = async (req, res) => {

  const { categoryName } = req.body;

  const cleanCategoryName = categoryName
  ? categoryName.trim()
  : "";

  // Validate category name
  if (
  !cleanCategoryName ||
  cleanCategoryName.length < 3 ||
  cleanCategoryName.length > 100
  ) {

  ```
   return res.render("edit-category", {

       title: "Edit Category",

       errors: [
           {
               msg: "Category name must be between 3 and 100 characters."
           }
       ],

       category: {

           category_id: req.params.id,

           name: cleanCategoryName

       }

   });
  ```

  }

  try {

  ```
   await updateCategory(
       req.params.id,
       cleanCategoryName
   );


   // Success flash message
   if (req.flash) {

       req.flash(
           "success",
           "Category updated successfully."
       );

   }


   res.redirect("/categories");
  ```

  } catch (error) {

  ```
   console.error("Error updating category:", error);


   if (error.code === "23505") {

       return res.render("edit-category", {

           title: "Edit Category",

           errors: [
               {
                   msg: "A category with this name already exists."
               }
           ],

           category: {

               category_id: req.params.id,

               name: cleanCategoryName

           }

       });

   }


   res.status(500).render("500", {
       title: "500 - Server Error"
   });
  ```

  }

};

export {
buildCategoryList,
buildCategoryDetail,
buildNewCategory,
addCategory,
buildEditCategory,
editCategory
};
