CREATE TABLE "products" (
 "id" SERIAL PRIMARY KEY,
  "name" varchar(20) NOT NULL,
  "description" varchar(50)  NULL,
  "price" integer NULL,
  "image" varchar NULL
 );

 CREATE TABLE "cart" (
  "id" SERIAL NOT NULL,
  "productid" integer NOT NULL,
  PRIMARY KEY (productid, id),
  FOREIGN KEY (productid) REFERENCES products (id)
 )