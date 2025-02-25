import React from 'react';
import './filter.scss';

const FilterDetails = ({itemDetails}) => {
  return (
    <>
        <p className='filter-title'>Product Details</p>
        <div className='filter--details'>
            <div className='filter--details--item'>
                <p className='filter--details--item-text'>Metal Color /Purity</p>
                <p className='filter--details--item-data'>{itemDetails.product_data.metal[0].name} | {itemDetails.product_data.metal[0].purity}</p>
            </div>
            <div className='filter--details--item'>
                <p className='filter--details--item-text'>Metal Weight (Approx.)</p>
                <p className='filter--details--item-data'>{itemDetails.product_data.metal[0].weight} Grams</p>
            </div>
            {
                itemDetails.product_data.stone.length>0 &&    
                <>
                    <div className='filter--details--item'>
                        <p className='filter--details--item-text'>Diamond Clarity/Color</p>
                        <p className='filter--details--item-data'>{itemDetails.product_data.stone[0].clarity} {itemDetails.product_data.stone[0].color}</p>
                    </div>
                
                    <div className='filter--details--item'>
                        <p className='filter--details--item-text'>Diamond Weight</p>
                        <p className='filter--details--item-data'>{itemDetails.product_data.stone[0].weight}</p>
                    </div>
                </>        
             }
            <div className='filter--details--item'>
                <p className='filter--details--item-text'>Making Charges</p>
                <p className='filter--details--item-data'>&#8377;{itemDetails.product_data.making_charge}/-</p>
            </div>
        </div>
    </>
  )
}

export default FilterDetails
