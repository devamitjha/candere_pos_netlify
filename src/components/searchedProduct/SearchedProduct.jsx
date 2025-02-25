import React from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { sheetClose } from '../../redux/bottomSheetSlice';
import { useSelector, useDispatch } from 'react-redux';
import SectionTitle from '../sectionTitle/SectionTitle';
import close from "../../assets/images/close.svg";
import { setCartCount } from '../../redux/atcSlice';
import Filter from '../filter/Filter';

const SearchedProduct = () => {
    const dispatch = useDispatch();
    
    // Get the necessary states from the Redux store
    const isSheetOpen = useSelector((state) => state.bottomSheet.isSheetOpen);
    const isSheetId = useSelector((state) => state.bottomSheet.isSheetId);
    const { isUser } = useSelector((state) => state.user);
    const { isAdding } = useSelector((state) => state.atc);
    
    // Get the selected product from the Redux store
    const selectedProduct = useSelector((state) => state.searchProduct.selectedProduct);

    return (
        <BottomSheet
            open={isSheetId === "searchResult" && isSheetOpen}
            onDismiss={() => dispatch(sheetClose())}
            defaultSnap={({ snapPoints, lastSnap }) =>
                lastSnap ?? Math.min(...snapPoints)
            }
            header={
                <div className='sheetHeader'>
                    <SectionTitle title="Product Details" />
                    <div className='sheetHeader--close' onClick={() => dispatch(sheetClose())}>
                        <img src={close} alt='BottomSheet Close' className='img-fluid' />
                    </div>
                </div>
            }
            footer={
                <div className='sheetFooter'>
                    {isUser && (
                        <button
                            className="addProduct base_btn btn_lg primary_btn"
                            // onClick={() => addProductToCart(selectedProduct)}
                            disabled={isAdding}
                        >
                            {isAdding ? 'Adding to cart...' : 'Add Product'}
                        </button>
                    )}
                </div>
            }
        >
            <div className='sheetBody'>
                {/* Ensure selectedProduct is available before rendering */}
                {selectedProduct ? (
                    <>
                        <h3>{selectedProduct.product_name}</h3>
                        <p>{selectedProduct.description}</p>
                        {/* Add other product details as needed */}
                        <Filter key={selectedProduct.product_id} productID={selectedProduct.priorityshipping_id} />
                    </>
                ) : (
                    <p>No product selected</p>
                )}
            </div>
        </BottomSheet>
    );
}

export default SearchedProduct;
