import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Pagination,
  Box
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductsAsync,
  resetProductFetchStatus,
  selectProductFetchStatus,
  selectProductIsFilterOpen,
  selectProductTotalResults,
  selectProducts,
  toggleFilters
} from '../ProductSlice';
import { ProductCard } from './ProductCard';
import AddIcon from '@mui/icons-material/Add';
import { selectBrands } from '../../brands/BrandSlice';
import { selectCategories } from '../../categories/CategoriesSlice';
import { ITEMS_PER_PAGE } from '../../../constants';
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlistItems
} from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { toast } from 'react-toastify';
import { banner1, banner2, banner3, banner4, loadingAnimation } from '../../../assets';
import {
  resetCartItemAddStatus,
  selectCartItemAddStatus
} from '../../cart/CartSlice';
import { motion } from 'framer-motion';
import ClearIcon from '@mui/icons-material/Clear';
import Lottie from 'lottie-react';

const sortOptions = [
  { name: 'Price: low to high', sort: 'price', order: 'asc' },
  { name: 'Price: high to low', sort: 'price', order: 'desc' }
];

const bannerImages = [banner1, banner3, banner2, banner4];

// ✅ INLINE ProductBanner Component (working fade animation)
const ProductBanner = ({ images }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      {images.map((img, i) => (
        <Box
          key={i}
          component="img"
          src={img}
          alt={`banner-${i}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1s ease-in-out'
          }}
        />
      ))}
    </Box>
  );
};

export const ProductList = () => {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);
  const theme = useTheme();

  const is1200 = useMediaQuery(theme.breakpoints.down(1200));
  const is800 = useMediaQuery(theme.breakpoints.down(800));
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is600 = useMediaQuery(theme.breakpoints.down(600));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is488 = useMediaQuery(theme.breakpoints.down(488));

  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);
  const totalResults = useSelector(selectProductTotalResults);
  const loggedInUser = useSelector(selectLoggedInUser);

  const productFetchStatus = useSelector(selectProductFetchStatus);

  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

  const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);

  const dispatch = useDispatch();

  const handleBrandFilters = (e) => {
    const filterSet = new Set(filters.brand);
    if (e.target.checked) filterSet.add(e.target.value);
    else filterSet.delete(e.target.value);
    const filterArray = Array.from(filterSet);
    setFilters({ ...filters, brand: filterArray });
  };

  const handleCategoryFilters = (e) => {
    const filterSet = new Set(filters.category);
    if (e.target.checked) filterSet.add(e.target.value);
    else filterSet.delete(e.target.value);
    const filterArray = Array.from(filterSet);
    setFilters({ ...filters, category: filterArray });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [totalResults]);

  useEffect(() => {
    const finalFilters = { ...filters };
    finalFilters['pagination'] = { page: page, limit: ITEMS_PER_PAGE };
    finalFilters['sort'] = sort;
    if (!loggedInUser?.isAdmin) finalFilters['user'] = true;
    dispatch(fetchProductsAsync(finalFilters));
  }, [filters, page, sort]);

  const handleAddRemoveFromWishlist = (e, productId) => {
    if (e.target.checked) {
      const data = { user: loggedInUser?._id, product: productId };
      dispatch(createWishlistItemAsync(data));
    } else {
      const index = wishlistItems.findIndex(
        (item) => item.product._id === productId
      );
      dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
    }
  };

  useEffect(() => {
    if (wishlistItemAddStatus === 'fulfilled')
      toast.success('Product added to wishlist');
    else if (wishlistItemAddStatus === 'rejected')
      toast.error('Error adding product to wishlist, please try again later');
  }, [wishlistItemAddStatus]);

  useEffect(() => {
    if (wishlistItemDeleteStatus === 'fulfilled')
      toast.success('Product removed from wishlist');
    else if (wishlistItemDeleteStatus === 'rejected')
      toast.error('Error removing product from wishlist, please try again later');
  }, [wishlistItemDeleteStatus]);

  useEffect(() => {
    if (cartItemAddStatus === 'fulfilled')
      toast.success('Product added to cart');
    else if (cartItemAddStatus === 'rejected')
      toast.error('Error adding product to cart, please try again later');
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (productFetchStatus === 'rejected')
      toast.error('Error fetching products, please try again later');
  }, [productFetchStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetProductFetchStatus());
      dispatch(resetWishlistItemAddStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetCartItemAddStatus());
    };
  }, []);

  const handleFilterClose = () => {
    dispatch(toggleFilters());
  };

  return (
    <>
      {productFetchStatus === 'pending' ? (
        <Stack
          width={is500 ? '35vh' : '25rem'}
          height={'calc(100vh - 4rem)'}
          justifyContent={'center'}
          marginRight={'auto'}
          marginLeft={'auto'}
        >
          <Lottie animationData={loadingAnimation} />
        </Stack>
      ) : (
        <>
          {/* Filters sidebar */}
          <motion.div
            style={{
              position: 'fixed',
              backgroundColor: 'white',
              height: '100vh',
              padding: '1rem',
              overflowY: 'scroll',
              width: is500 ? '100vw' : '30rem',
              zIndex: 500
            }}
            variants={{ show: { left: 0 }, hide: { left: -500 } }}
            initial={'hide'}
            transition={{ ease: 'easeInOut', duration: 0.7, type: 'spring' }}
            animate={isProductFilterOpen === true ? 'show' : 'hide'}
          >
            {/* Filter Section */}
            <Stack mb={'5rem'} sx={{ scrollBehavior: 'smooth', overflowY: 'scroll' }}>
              <Typography variant="h4">New Arrivals</Typography>

              <IconButton
                onClick={handleFilterClose}
                style={{ position: 'absolute', top: 15, right: 15 }}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <ClearIcon fontSize="medium" />
                </motion.div>
              </IconButton>

              {/* Brand Filters */}
              <Stack mt={2}>
                <Accordion>
                  <AccordionSummary expandIcon={<AddIcon />}>
                    <Typography>Author</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <FormGroup onChange={handleBrandFilters}>
                      {brands?.map((brand) => (
                        <motion.div
                          key={brand._id}
                          style={{ width: 'fit-content' }}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FormControlLabel
                            sx={{ ml: 1 }}
                            control={<Checkbox />}
                            label={brand.name}
                            value={brand._id}
                          />
                        </motion.div>
                      ))}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Stack>

              {/* Category Filters */}
              <Stack mt={2}>
                <Accordion>
                  <AccordionSummary expandIcon={<AddIcon />}>
                    <Typography>Category</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <FormGroup onChange={handleCategoryFilters}>
                      {categories?.map((cat) => (
                        <motion.div
                          key={cat._id}
                          style={{ width: 'fit-content' }}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FormControlLabel
                            sx={{ ml: 1 }}
                            control={<Checkbox />}
                            label={cat.name}
                            value={cat._id}
                          />
                        </motion.div>
                      ))}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Stack>
          </motion.div>

          {/* Main Content */}
          <Stack mb={'3rem'}>
            {/* Banner Section */}
            {!is600 && (
              <Stack
                sx={{
                  width: '100%',
                  height: is800 ? '300px' : is1200 ? '400px' : '500px'
                }}
              >
                <ProductBanner images={bannerImages} />
              </Stack>
            )}

            {/* Product Section */}
            <Stack rowGap={5} mt={is600 ? 2 : 0}>
              {/* Sort */}
              <Stack
                flexDirection={'row'}
                mr={'2rem'}
                justifyContent={'flex-end'}
                alignItems={'center'}
                columnGap={5}
              >
                <Stack alignSelf={'flex-end'} width={'12rem'}>
                  <FormControl fullWidth>
                    <InputLabel id="sort-dropdown">Sort</InputLabel>
                    <Select
                      variant="standard"
                      labelId="sort-dropdown"
                      label="Sort"
                      onChange={(e) => setSort(e.target.value)}
                      value={sort}
                    >
                      <MenuItem value={null}>Reset</MenuItem>
                      {sortOptions.map((opt) => (
                        <MenuItem key={opt.name} value={opt}>
                          {opt.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>

              {/* Product Grid */}
              <Grid gap={is700 ? 1 : 2} container justifyContent="center">
                {products.map((prod) => (
                  <ProductCard
                    key={prod._id}
                    id={prod._id}
                    title={prod.title}
                    thumbnail={prod.coverImage}
                    brand={prod.brand.name}
                    price={prod.price}
                    handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                  />
                ))}
              </Grid>

              {/* Pagination */}
              <Stack
                alignSelf={is488 ? 'center' : 'flex-end'}
                mr={is488 ? 0 : 5}
                rowGap={2}
                p={is488 ? 1 : 0}
              >
                <Pagination
                  size={is488 ? 'medium' : 'large'}
                  page={page}
                  onChange={(e, val) => setPage(val)}
                  count={Math.ceil(totalResults / ITEMS_PER_PAGE)}
                  variant="outlined"
                  shape="rounded"
                />
                <Typography textAlign="center">
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {page * ITEMS_PER_PAGE > totalResults
                    ? totalResults
                    : page * ITEMS_PER_PAGE}{' '}
                  of {totalResults} results
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </>
      )}
    </>
  );
};