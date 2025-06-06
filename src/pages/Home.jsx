import { Link } from "react-router-dom";
import { CarouselData } from "../components/ListingData";
import { CategoryData } from "../components/ListingData";
import { SpecialCollectionData } from "../components/ListingData";
import "../Style.css";

export default function Home() {
  return (
    <>
      <main className="container py-3">
        {/* Carousel Part */}
        <div
          id="carouselComponent"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            {CarouselData.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselComponent"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : undefined}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>

          <div className="carousel-inner">
            {CarouselData.map((item, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={item.imageUrl}
                  className="d-block w-100"
                  alt={item.heading}
                />
                <div className="carousel-caption bg-dark bg-opacity-50 rounded">
                  <h5 className="d-block">{item.heading}</h5>
                  <p className="d-none d-md-block">{item.content}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselComponent"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselComponent"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* Shopping Category Part */}
        <h1 className="text-center pt-4 pb-2 fw-bold">Shop By Category</h1>
        <div className="row g-3">
          {CategoryData.map((item, index) => (
            <div className="col-6 col-md-4 col-lg-3" key={index}>
              <Link to="/products" className="text-decoration-none">
                <div className="card hover-card h-100 shadow-sm">
                  <div
                    className="position-relative"
                    style={{ height: "200px" }}
                  >
                    <img
                      src={item.imageUrl}
                      className="card-img-top position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                      alt={`Category ${item.cateory}`}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-body d-flex align-items-center justify-content-center">
                    <h5 className="card-title text-center mb-0">
                      {item.cateory}
                    </h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Special Trending Part */}
        <h1 className="text-center py-4 fw-bold">
          Exclusive Picks Just for You
        </h1>
        <div className="row g-4">
          {SpecialCollectionData.map((collection, index) => (
            <div className="col-md-6" key={index}>
              <div className="card special-collection-card position-relative overflow-hidden shadow-lg">
                <div className="special-card-img-wrapper">
                  <img
                    src={collection.collectionImg}
                    className="card-img w-100 h-100 object-fit-cover"
                    alt={collection.heading}
                    style={{
                      height: "300px",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
                <div className="card-img-overlay d-flex flex-column justify-content-end p-4">
                  <div className="special-overlay-bg bg-dark bg-opacity-75 p-3 rounded">
                    <h3 className="card-title text-white fw-bold mb-2">
                      {collection.heading}
                    </h3>
                    <p className="card-text text-light mb-3">
                      {collection.caption}
                    </p>
                    <Link
                      to="/products"
                      className="btn btn-primary btn-sm px-4 py-2 fw-semibold"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
