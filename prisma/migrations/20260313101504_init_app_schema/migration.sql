-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RecipeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kkal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "proteins" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fats" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "carbohydrates" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_vegetarian" BOOLEAN NOT NULL DEFAULT false,
    "product_category_id" TEXT NOT NULL,
    "is_common" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hiking" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "days_total" INTEGER NOT NULL,
    "members_total" INTEGER NOT NULL,
    "vegetarians_total" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Hiking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Eating" (
    "id" TEXT NOT NULL,
    "hiking_id" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "eating_time_id" TEXT NOT NULL,

    CONSTRAINT "Eating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EatingTime" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EatingTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EatingIngredient" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "personal_quantity" DOUBLE PRECISION NOT NULL,
    "total_quantity" DOUBLE PRECISION NOT NULL,
    "eating_id" TEXT NOT NULL,

    CONSTRAINT "EatingIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeCategory_name_key" ON "RecipeCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EatingTime_name_key" ON "EatingTime"("name");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "RecipeCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_product_category_id_fkey" FOREIGN KEY ("product_category_id") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hiking" ADD CONSTRAINT "Hiking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eating" ADD CONSTRAINT "Eating_hiking_id_fkey" FOREIGN KEY ("hiking_id") REFERENCES "Hiking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eating" ADD CONSTRAINT "Eating_eating_time_id_fkey" FOREIGN KEY ("eating_time_id") REFERENCES "EatingTime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EatingIngredient" ADD CONSTRAINT "EatingIngredient_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EatingIngredient" ADD CONSTRAINT "EatingIngredient_eating_id_fkey" FOREIGN KEY ("eating_id") REFERENCES "Eating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
