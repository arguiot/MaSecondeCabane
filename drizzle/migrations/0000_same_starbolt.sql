CREATE TABLE IF NOT EXISTS "Address" (
	"id" bigint PRIMARY KEY NOT NULL,
	"street" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	"zipCode" varchar(20) NOT NULL,
	CONSTRAINT "Address_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Customer" (
	"id" bigint PRIMARY KEY NOT NULL,
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255) NOT NULL,
	"addressId" bigint NOT NULL,
	"telephone" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "Customer_id_unique" UNIQUE("id"),
	CONSTRAINT "Customer_addressId_unique" UNIQUE("addressId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Order" (
	"id" bigint PRIMARY KEY NOT NULL,
	"ts" bigint NOT NULL,
	"customerId" bigint NOT NULL,
	"stripeID" varchar(255) NOT NULL,
	"total" double precision NOT NULL,
	"done" boolean,
	"delivery" boolean DEFAULT false NOT NULL,
	CONSTRAINT "Order_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OrderProductLine" (
	"id" bigint PRIMARY KEY NOT NULL,
	"orderId" bigint NOT NULL,
	"productId" bigint NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "OrderProductLine_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Products" (
	"id" bigint PRIMARY KEY NOT NULL,
	"ts" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"descriptionEn" text,
	"price" integer NOT NULL,
	"boughtPrice" integer,
	"waitingForCollect" boolean,
	"quantity" integer NOT NULL,
	"image" varchar(255) NOT NULL,
	"sexe" varchar(255) NOT NULL,
	"size" varchar(255) NOT NULL,
	"brand" varchar(255) NOT NULL,
	"etat" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"tags" json,
	"creation" bigint NOT NULL,
	"favorite" boolean NOT NULL,
	"composition" json,
	CONSTRAINT "Products_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Request" (
	"id" bigint PRIMARY KEY NOT NULL,
	"ts" bigint NOT NULL,
	"customerId" bigint NOT NULL,
	"description" text NOT NULL,
	"done" boolean,
	CONSTRAINT "Request_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WebsiteConfig" (
	"id" bigint PRIMARY KEY NOT NULL,
	"locked" boolean NOT NULL,
	"popUpAddressId" bigint NOT NULL,
	"freeShipping" integer NOT NULL,
	"delayDelivery" varchar(255),
	"promoFr" varchar(255) NOT NULL,
	"promoEn" varchar(255) NOT NULL,
	CONSTRAINT "WebsiteConfig_id_unique" UNIQUE("id"),
	CONSTRAINT "WebsiteConfig_popUpAddressId_unique" UNIQUE("popUpAddressId")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "address_idx" ON "Address" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_idx" ON "Customer" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_idx" ON "Order" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orderProductLine_idx" ON "OrderProductLine" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_idx" ON "Products" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "request_idx" ON "Request" ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Customer" ADD CONSTRAINT "Customer_addressId_Address_id_fk" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_Customer_id_fk" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OrderProductLine" ADD CONSTRAINT "OrderProductLine_orderId_Order_id_fk" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OrderProductLine" ADD CONSTRAINT "OrderProductLine_productId_Products_id_fk" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Request" ADD CONSTRAINT "Request_customerId_Customer_id_fk" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WebsiteConfig" ADD CONSTRAINT "WebsiteConfig_popUpAddressId_Address_id_fk" FOREIGN KEY ("popUpAddressId") REFERENCES "Address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
