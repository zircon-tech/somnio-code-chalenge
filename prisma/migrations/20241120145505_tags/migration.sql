-- CreateTable
CREATE TABLE "TagOfProduct" (
    "productId" TEXT NOT NULL,
    "tagValue" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TagOfProduct_productId_tagValue_key" ON "TagOfProduct"("productId", "tagValue");

-- AddForeignKey
ALTER TABLE "TagOfProduct" ADD CONSTRAINT "TagOfProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
