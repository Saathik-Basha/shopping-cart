import React, { useState } from 'react';
import styled from 'styled-components';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MdAddShoppingCart } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';
import { IoIosHeart, IoMdHeartEmpty } from "react-icons/io";

const darkTheme = createTheme({
  palette: {
    primary: {
      main: 'rgba(0, 0, 0, 0.8)',
    },
    secondary: {
      main: 'rgba(237, 242, 255, 0.8)',
    },
  },
});

const BoxSide = styled.div`
  float: left;
  padding: 20px;
`;

const BoxContainer = styled(Box)`
  width: 250px;
  height: 400px;
  margin: 20px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.5);
  }
`;

const IconButton = styled(Button)`
  && {
    padding: 0;
    min-width: unset;
    width: auto;
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: transparent;
    color: rgba(0, 0, 0, 0.6);
    opacity: 0;
    transition: opacity 0.3s ease;

    ${BoxContainer}:hover & {
      opacity: 1;
    }

    &:hover {
      color: white;
    }
  }
`;

const HeartIcon = styled(IoIosHeart)`
  font-size: 24px;
  color: red;
`;

const HeartIconEmpty = styled(IoMdHeartEmpty)`
  font-size: 24px;
`;

const Image = styled.img`
  width: 150px;
  height: 150px;
  margin-bottom: 10px;
  border-radius: 10px;
`;

const Title = styled(Typography)`
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 0.8);
`;

const Brand = styled(Typography)`
  font-style: italic;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
`;

const Price = styled(Typography)`
  color: rgba(0, 0, 0, 0.8);
  font-size: 16px;
  margin-bottom: 10px;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;

  button {
    margin-right: 10px;
    padding: 8px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ActionIcon = styled.span`
  font-size: 20px;
`;

function Product({ product, total, money, basket, setBasket, value }) {
  const [ProductItem, setProductItem] = useState(checkIfProduct(product.id));

  function checkIfProduct(productİtemId) {
    const ProductsItems = JSON.parse(localStorage.getItem('Products')) || [];
    return ProductsItems.includes(productİtemId)
  }

  const toggleProduct = () => {
    const productId = product.id;
    let ProductItems = JSON.parse(localStorage.getItem('Products')) || [];

    const productIndex = ProductItems.findIndex(item => item.id === productId);

    if (productIndex === -1) {
      ProductItems.push({ id: productId, quantity: 1 });
    } else {
      ProductItems[productIndex].quantity += 1;
    }

    localStorage.setItem('Products', JSON.stringify(ProductItems));
    setProductItem(!ProductItem);

    toast.success('Product successfully added to cart', {
      style: {
        boxShadow: 'none',
      },
    });
  };

  const basketItem = basket.find((item) => item.id === product.id) || [];

  const [isFavorite, setIsFavorite] = useState(checkIfFavorite(product.id));

  function checkIfFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem('Favorites')) || [];
    return favorites.includes(productId);
  }

  const toggleFavorite = () => {
    const productId = product.id;
    const favorites = JSON.parse(localStorage.getItem('Favorites')) || [];

    if (!isFavorite) {
      favorites.push(productId);
      localStorage.setItem('Favorites', JSON.stringify(favorites));

      toast.success('Product successfully added to favorites', {
        style: {
          boxShadow: 'none',
        },
      });
    } else {
      const updatedFavorites = favorites.filter((favId) => favId !== productId);
      localStorage.setItem('Favorites', JSON.stringify(updatedFavorites));

      toast.success('Product removed from favorites', {
        style: {
          boxShadow: 'none',
        },
      });
    }

    setIsFavorite(!isFavorite);
  };

  const DeleteProduct = (productId) => {
    const DeleteProducts = JSON.parse(localStorage.getItem('Products')) || [];
    let updatedFavorites = [...DeleteProducts];
    let shouldRemoveProduct = false;

    updatedFavorites = updatedFavorites.map(product => {
      if (product.id === productId) {
        product.quantity -= 1;
        if (product.quantity === 0) {
          shouldRemoveProduct = true;
        }
      }
      return product;
    });

    if (shouldRemoveProduct) {
      updatedFavorites = updatedFavorites.filter(product => product.id !== productId);
    }

    localStorage.setItem('Products', JSON.stringify(updatedFavorites));

    toast.error('The product has been successfully removed from your cart', {
      style: {
        boxShadow: 'none',
      },
    });
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <BoxSide>
          <Toaster />
          <BoxContainer
            p={2}
            bgcolor="#fff"
            border="1px solid #ddd"
            marginBottom="20px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            borderRadius="20px"
          >
            <IconButton variant="icon" onClick={toggleFavorite}>
              {isFavorite ? <HeartIcon /> : <HeartIconEmpty />}
            </IconButton>

            <Image src={product.thumbnail} alt="" />

            <Title variant="h6">{product.title}</Title>
            <Brand variant="subtitle1">{product.brand}</Brand>

            <Price variant="body1">${product.price}</Price>

            <ActionButtons>
              <Button onClick={() => DeleteProduct(product.id)} style={{ backgroundColor: 'red' }}>
                <ActionIcon style={{ color: 'white' }}><FaRegTrashCan /></ActionIcon>
              </Button>
              <Button
                variant="contained"
                disabled={total + product.price > money}
                onClick={toggleProduct}
                style={{ backgroundColor: 'green' }}
              >
                <ActionIcon style={{ color: 'white' }}><MdAddShoppingCart /></ActionIcon>
              </Button>
            </ActionButtons>
          </BoxContainer>
        </BoxSide>
      </ThemeProvider>
    </>
  );
};

export default Product;