import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Card from '../card/Card';
import Pageinfo from '../pageinfo/Pageinfo';
import SectionTitle from '../sectionTitle/SectionTitle';
import { useSelector, useDispatch } from 'react-redux';
import { setProducts, setLoading, setTotalProducts, setProductType, clearProducts } from '../../redux/productSlice';
import ScrollToTop from '../scrollTop/ScrollToTop';
import { fetchProductsData } from '../../services/fetchProductData';
import './list.scss';
import Searchbox from '../searchbox/Searchbox';

const List = () => {
  const params = useParams();
  const selectedCategory = params.label;
  const dispatch = useDispatch();
  const productsList = useSelector((state) => state.products.items);
  const { totalProducts, productType } = useSelector((state) => state.products);
  const isLoading = useSelector((state) => state.products.loading);
  const [page, setPage] = useState(1);
  const [lastPageNumber, setLastPageNumber] = useState(null);
  const observerRef = useRef(null);
  const { storeCode, agentCodeOrPhone } = useSelector((state) => state.agent);
  const { customer_id } = useSelector((state) => state.user);
  const selectedStore = useSelector((state) => state.nearbyStore.selectedStore);
  const [categoryTitle, setCategoryTitle] = useState(selectedCategory);
  const [categoryValue, setCategoryValue] = useState('');

  const fetchProducts = async (currentPage) => {
    const selectedStoreCode = selectedStore?.code;
    if (lastPageNumber && currentPage > lastPageNumber) return;
    dispatch(setLoading(true));
    try {
      const productResponseData = await fetchProductsData(
        selectedStoreCode ? selectedStoreCode : storeCode,
        agentCodeOrPhone,
        customer_id,
        categoryValue,
        currentPage
      );

      if (productResponseData.data.status === 'success') {
        const { products, product_types, productCount, lastPageNumber } = productResponseData.data;
        dispatch(setProducts(products));
        dispatch(setProductType(product_types));
        dispatch(setTotalProducts(productCount));
        setLastPageNumber(lastPageNumber);
      }
    } catch (error) {
      console.error('Error Fetching data:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && (!lastPageNumber || page < lastPageNumber)) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const categoryMap = {
      all: '',
      rings: '583',
      earrings: '584',
      necklace: '682',
      bangles: '586',
      bracelet: '591',
      solitaire: '1579',
      mangalsutra: '1057',
      otherJewellery: '1890',
      gift: '985',
    };

    const newCategoryValue = categoryMap[selectedCategory] || '';
    setCategoryValue(newCategoryValue);
    setPage(1);
    dispatch(clearProducts());
  }, [selectedCategory, dispatch]);

  const fetchAllProduct = ()=>{
    setCategoryValue("");
    setPage(1);
    dispatch(clearProducts());
    fetchProducts(page);
  }

  useEffect(() => {
    if (selectedCategory === 'all') {
        setCategoryValue("");
        setPage(1);
        dispatch(clearProducts());
        fetchProducts(page);
    }
  }, []);

  useEffect(() => {
    // Fetch products only if categoryValue is not empty and has changed
    if (categoryValue !== '') {
      fetchProducts(page);
    }
  }, [categoryValue, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });

    if (observerRef.current) observerRef.current.disconnect();

    const productToObserveIndex = (page - 1) * 20 + 15; // 15th product of the current page
    const productToObserve = document.querySelector(`.productCategories--item-${productToObserveIndex}`);

    if (productToObserve) {
      observer.observe(productToObserve);
    }

    observerRef.current = observer;
    return () => observer.disconnect();
  }, [productsList, page]);

  return (
    <>
    <Searchbox/>
      <div className="plpWrapper">
        <SectionTitle title="Product Catalogue (Instore)" />
        <div className="productCategories">
          <p className="productCategories-title">Product Categories</p>
          <div className="productCategories--options">
            <ul className="productCategories--lists">
              <NavLink to="/categories/all" className="productCategories--item" onClick={fetchAllProduct}>All Jewellery</NavLink>
              <NavLink to="/categories/rings" className="productCategories--item">Rings</NavLink>
              <NavLink to="/categories/earrings" className="productCategories--item">Earrings</NavLink>
              <NavLink to="/categories/necklace" className="productCategories--item">Necklace</NavLink>
            </ul>
            <NavLink className="productCategories--action" to="/categories">Experience Candere</NavLink>
          </div>
        </div>
        <Pageinfo
          title={selectedCategory==="all"? "All Jewellery" : selectedCategory}
          count={
            totalProducts > 1
              ? `${totalProducts} Items`
              : `${totalProducts} Item`
          }
        />
        <div className="cardWrapper">
          {productsList?.length > 0 &&
            productsList.map((item, index) => (
              <Card
                key={`ps-${index + 1}`}
                item={item}
                className={`productCategories--item-${index + 1}`}
              />
            ))}
          <ScrollToTop />
        </div>
        {isLoading && (
          <div className="cardWrapper placeholderLoading" style={{ marginTop: '20px' }}>
              <div className="ph-item alignItemCenter">
                  <div className="ph-col-12">
                      <div className="ph-picture mb-15"></div>
                      <div className="ph-row">                            
                          <div className="ph-col-4"></div>
                          <div className="ph-col-8 empty"></div>
                          <div className="ph-col-6"></div>
                          <div className="ph-col-6 empty"></div>
                          <div className="ph-col-12"></div>
                      </div>
                  </div>
              </div>
              <div className="ph-item alignItemCenter">
                  <div className="ph-col-12">
                      <div className="ph-picture mb-15"></div>
                      <div className="ph-row">                           
                          <div className="ph-col-4"></div>
                          <div className="ph-col-8 empty"></div>
                          <div className="ph-col-6"></div>
                          <div className="ph-col-6 empty"></div>
                          <div className="ph-col-12"></div>
                      </div>
                  </div>
              </div>
              <div className="ph-item alignItemCenter">
                  <div className="ph-col-12">
                      <div className="ph-picture mb-15"></div>
                      <div className="ph-row">                            
                          <div className="ph-col-4"></div>
                          <div className="ph-col-8 empty"></div>
                          <div className="ph-col-6"></div>
                          <div className="ph-col-6 empty"></div>
                          <div className="ph-col-12"></div>
                      </div>
                  </div>
              </div>
              <div className="ph-item alignItemCenter">
                  <div className="ph-col-12">
                      <div className="ph-picture mb-15"></div>
                      <div className="ph-row">                            
                          <div className="ph-col-4"></div>
                          <div className="ph-col-8 empty"></div>
                          <div className="ph-col-6"></div>
                          <div className="ph-col-6 empty"></div>
                          <div className="ph-col-12"></div>
                      </div>
                  </div>
              </div>
              <div className="ph-item alignItemCenter">
                  <div className="ph-col-12">
                      <div className="ph-picture mb-15"></div>
                      <div className="ph-row">                            
                          <div className="ph-col-4"></div>
                          <div className="ph-col-8 empty"></div>
                          <div className="ph-col-6"></div>
                          <div className="ph-col-6 empty"></div>
                          <div className="ph-col-12"></div>
                      </div>
                  </div>
              </div>
              <div className="ph-item alignItemCenter">
                  <div className="ph-col-12">
                      <div className="ph-picture mb-15"></div>
                      <div className="ph-row">                            
                          <div className="ph-col-4"></div>
                          <div className="ph-col-8 empty"></div>
                          <div className="ph-col-6"></div>
                          <div className="ph-col-6 empty"></div>
                          <div className="ph-col-12"></div>
                      </div>
                  </div>
              </div>
          </div>
        )}
        {!isLoading && lastPageNumber && page >= lastPageNumber && (
          <div className="endOfDataMessage" style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>No more data to load</p>
          </div>
        )}
      </div>
    </>
  );
};

export default List;