import React from 'react';
import './filter.scss';
import ProductSlider from './ProductSlider';

const FilterCard = ({itemDetails}) => {
  const productImages = itemDetails.product_data.images;
  const productName = itemDetails.product_name;
  return (
    <>
    <div className='filter--card'>
        <div className='filter--card-image'>
            <img src={itemDetails.product_data.images[0].metal_image} alt={itemDetails.product_name} className="img-fluid" />
        </div>
        <div className='filter--card--data'>
            <p className="filter--card--data-name">{itemDetails.product_name}</p>
            <div className="filter--card--data-price">
              {
                  itemDetails.product_data.discount_applied_price ? (
                      <>
                          <p className="filter--card--data-price-new">&#8377;{Math.trunc(itemDetails.product_data.discount_applied_price)}</p>
                          <p className="filter--card--data-price-old">&#8377;{Math.trunc(itemDetails.product_data.price)}</p>
                      </>
                  ) : (
                      <>
                          <p className="filter--card--data-price-new">&#8377;{Math.trunc(itemDetails.product_data.price)}</p>
                      </>
                  )
              }
            </div>
            <p className="filter--card--data-offer">
              {itemDetails.product_data.discount_label}
            </p>
        </div>
    </div>
    <div className="sliderContainer">
      <ProductSlider itemImages={productImages} itemName={productName}/>
    </div>
    </>
  )
}

export default FilterCard
