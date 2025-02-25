import React from 'react';
import './filter.scss';

const FilterVariant = () => {
  return (
    <div className='variant'>
        <div className='variant-wrapper'>
            <p className='filter-title'>Pick Your Metal</p>
            <div className='variant--box-wrapper'>
                <div className='variant--box selected'>
                    <p className='variant--box-top'>14KT</p>
                    <p className='variant--box-mid'>White Gold</p>
                    <p className='variant--box-bottom'>Made to Order</p>
                </div>
                <div className='variant--box'>
                    <p className='variant--box-top'>18KT</p>
                    <p className='variant--box-mid'>Yellow Gold</p>
                    <p className='variant--box-bottom'>Made to Order</p>
                </div>
                <div className='variant--box'>
                    <p className='variant--box-top'>18KT</p>
                    <p className='variant--box-mid'>Rose Gold</p>
                    <p className='variant--box-bottom'>Made to Order</p>
                </div>
                <div className='variant--box'>
                    <p className='variant--box-top'>950</p>
                    <p className='variant--box-mid'>Platinum</p>
                    <p className='variant--box-bottom'>Made to Order</p>
                </div>
            </div>
        </div>

        <div className='variant-wrapper'>
            <p className='filter-title'>Pick your Diamond Quality</p>
            <div className='variant--box-wrapper'>
                <div className='variant--box'>
                    <p className='variant--box-top'>VVS-EF</p>
                    <p className='variant--box-bottom'>In Stock</p>
                </div>
                <div className='variant--box selected'>
                    <p className='variant--box-top'>VS-EF</p>
                    <p className='variant--box-bottom'>In Stock</p>
                </div>
                <div className='variant--box'>
                    <p className='variant--box-top'>SI-GH</p>
                    <p className='variant--box-bottom'>Limited Stock</p>
                </div>
                <div className='variant--box'>
                    <p className='variant--box-top'>SI-IJ</p>
                    <p className='variant--box-bottom'>In Stock</p>
                </div>
            </div>
        </div>

        <div className='variant-wrapper'>
            <p className='filter-title'>Pick your Size</p>
            <div className='variant--box-wrapper'>
                <div className='variant--box selected'>
                    <p className='variant--box-top'>Size: 5</p>
                    <p className='variant--box-mid'>45.9 mm</p>
                    <p className='variant--box-bottom'>Made to Order</p>
                </div>
                <div className='variant--box'>
                    <p className='variant--box-top'>Size: 6</p>
                    <p className='variant--box-mid'>45.9 mm</p>
                    <p className='variant--box-bottom'>Made to Order</p>
                </div>
                <div className='variant--box'>
                    <p className='variant--box-top'>Size: 7</p>
                    <p className='variant--box-mid'>45.9 mm</p>
                    <p className='variant--box-bottom'>Made to Order</p>
                </div>
                <div className='variant--box'>
                    <p className='variant--box-top'>Size: 8</p>
                    <p className='variant--box-mid'>45.9 mm</p>
                    <p className='variant--box-bottom'>Made to Order</p>
                </div>
                <div className='variant--box'>
                    <p className='variant--box-top'>Size: 9</p>
                    <p className='variant--box-mid'>45.9 mm</p>
                    <p className='variant--box-bottom'>Made to Order</p>
                </div>
                <div className='variant--box'>
                    <p className='variant--box-top'>Size: 10</p>
                    <p className='variant--box-mid'>45.9 mm</p>
                    <p className='variant--box-bottom'>Made to Order</p>
                </div>
                <div className='variant--box'>
                    <p className='variant--box-top'>Size: 11</p>
                    <p className='variant--box-mid'>45.9 mm</p>
                    <p className='variant--box-bottom'>Made to Order</p>
                </div>
                <div className='variant--box'>
                    <p className='variant--box-top'>Size: 12</p>
                    <p className='variant--box-mid'>45.9 mm</p>
                    <p className='variant--box-bottom'>Made to Order</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FilterVariant
