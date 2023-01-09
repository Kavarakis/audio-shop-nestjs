CREATE TABLE public."Artist" (
	"ArtistId" int4 NOT NULL,
	"Name" varchar(120) NULL,
	CONSTRAINT "PK_Artist" PRIMARY KEY ("ArtistId")
);

CREATE TABLE public."Genre" (
	"GenreId" int4 NOT NULL,
	"Name" varchar(120) NULL,
	CONSTRAINT "PK_Genre" PRIMARY KEY ("GenreId")
);

CREATE TABLE public."MediaType" (
	"MediaTypeId" int4 NOT NULL,
	"Name" varchar(120) NULL,
	CONSTRAINT "PK_MediaType" PRIMARY KEY ("MediaTypeId")
);

CREATE TABLE public."Playlist" (
	"PlaylistId" int4 NOT NULL,
	"Name" varchar(120) NULL,
	CONSTRAINT "PK_Playlist" PRIMARY KEY ("PlaylistId")
);

CREATE TABLE public."Album" (
	"AlbumId" int4 NOT NULL,
	"Title" varchar(160) NOT NULL,
	"ArtistId" int4 NOT NULL,
	CONSTRAINT "PK_Album" PRIMARY KEY ("AlbumId"),
	CONSTRAINT "FK_AlbumArtistId" FOREIGN KEY ("ArtistId") REFERENCES public."Artist"("ArtistId")
);

CREATE TABLE public."Employee" (
	"EmployeeId" int4 NOT NULL,
	"LastName" varchar(20) NOT NULL,
	"FirstName" varchar(20) NOT NULL,
	"Title" varchar(30) NULL,
	"ReportsTo" int4 NULL,
	"BirthDate" timestamp NULL,
	"HireDate" timestamp NULL,
	"Address" varchar(70) NULL,
	"City" varchar(40) NULL,
	"State" varchar(40) NULL,
	"Country" varchar(40) NULL,
	"PostalCode" varchar(10) NULL,
	"Phone" varchar(24) NULL,
	"Fax" varchar(24) NULL,
	"Email" varchar(60) NULL,
	CONSTRAINT "PK_Employee" PRIMARY KEY ("EmployeeId"),
	CONSTRAINT "FK_EmployeeReportsTo" FOREIGN KEY ("ReportsTo") REFERENCES public."Employee"("EmployeeId")
);

CREATE SEQUENCE employee_id_seq OWNED BY "Employee"."EmployeeId";
SELECT setval('employee_id_seq', coalesce(max("EmployeeId"), 0) + 1, false) FROM "Employee";
ALTER TABLE "Employee" ALTER COLUMN "EmployeeId" SET DEFAULT nextval('employee_id_seq');

CREATE TABLE public."Track" (
	"TrackId" int4 NOT NULL,
	"Name" varchar(200) NOT NULL,
	"AlbumId" int4 NULL,
	"MediaTypeId" int4 NOT NULL,
	"GenreId" int4 NULL,
	"Composer" varchar(220) NULL,
	"Milliseconds" int4 NOT NULL,
	"Bytes" int4 NULL,
	"UnitPrice" numeric(10, 2) NOT NULL,
	CONSTRAINT "PK_Track" PRIMARY KEY ("TrackId"),
	CONSTRAINT "FK_TrackAlbumId" FOREIGN KEY ("AlbumId") REFERENCES public."Album"("AlbumId"),
	CONSTRAINT "FK_TrackGenreId" FOREIGN KEY ("GenreId") REFERENCES public."Genre"("GenreId"),
	CONSTRAINT "FK_TrackMediaTypeId" FOREIGN KEY ("MediaTypeId") REFERENCES public."MediaType"("MediaTypeId")
);

CREATE TABLE public."Customer" (
	"CustomerId" int4 NOT NULL,
	"FirstName" varchar(40) NOT NULL,
	"LastName" varchar(20) NOT NULL,
	"Company" varchar(80) NULL,
	"Address" varchar(70) NULL,
	"City" varchar(40) NULL,
	"State" varchar(40) NULL,
	"Country" varchar(40) NULL,
	"PostalCode" varchar(10) NULL,
	"Phone" varchar(24) NULL,
	"Fax" varchar(24) NULL,
	"Email" varchar(60) NOT NULL,
	"SupportRepId" int4 NULL,
	CONSTRAINT "PK_Customer" PRIMARY KEY ("CustomerId"),
	CONSTRAINT "FK_CustomerSupportRepId" FOREIGN KEY ("SupportRepId") REFERENCES public."Employee"("EmployeeId")
);

CREATE TABLE public."Invoice" (
	"InvoiceId" int4 NOT NULL,
	"CustomerId" int4 NOT NULL,
	"InvoiceDate" timestamp NOT NULL,
	"BillingAddress" varchar(70) NULL,
	"BillingCity" varchar(40) NULL,
	"BillingState" varchar(40) NULL,
	"BillingCountry" varchar(40) NULL,
	"BillingPostalCode" varchar(10) NULL,
	"Total" numeric(10, 2) NOT NULL,
	CONSTRAINT "PK_Invoice" PRIMARY KEY ("InvoiceId"),
	CONSTRAINT "FK_InvoiceCustomerId" FOREIGN KEY ("CustomerId") REFERENCES public."Customer"("CustomerId")
);

CREATE TABLE public."InvoiceLine" (
	"InvoiceLineId" int4 NOT NULL,
	"InvoiceId" int4 NOT NULL,
	"TrackId" int4 NOT NULL,
	"UnitPrice" numeric(10, 2) NOT NULL,
	"Quantity" int4 NOT NULL,
	CONSTRAINT "PK_InvoiceLine" PRIMARY KEY ("InvoiceLineId"),
	CONSTRAINT "FK_InvoiceLineInvoiceId" FOREIGN KEY ("InvoiceId") REFERENCES public."Invoice"("InvoiceId"),
	CONSTRAINT "FK_InvoiceLineTrackId" FOREIGN KEY ("TrackId") REFERENCES public."Track"("TrackId")
);

CREATE TABLE public."PlaylistTrack" (
	"PlaylistId" int4 NOT NULL,
	"TrackId" int4 NOT NULL,
	CONSTRAINT "PK_PlaylistTrack" PRIMARY KEY ("PlaylistId", "TrackId"),
	CONSTRAINT "FK_PlaylistTrackPlaylistId" FOREIGN KEY ("PlaylistId") REFERENCES public."Playlist"("PlaylistId"),
	CONSTRAINT "FK_PlaylistTrackTrackId" FOREIGN KEY ("TrackId") REFERENCES public."Track"("TrackId")
);
