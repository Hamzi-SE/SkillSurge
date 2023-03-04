import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  HStack,
  Input,
  useColorMode,
} from '@chakra-ui/react';
import { RiSecurePaymentFill } from 'react-icons/ri';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import {
  getStripePublishableKey,
  createSubscription,
} from '../../redux/actions/payment';
import { useNavigate } from 'react-router-dom';

const Subscribe = () => {
  const [stripePromise, setStripePromise] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stripePublishableKey } = useSelector(state => state.payment);

  useEffect(() => {
    // get stripe publishable keys
    dispatch(getStripePublishableKey());

    // load stripe
    if (stripePublishableKey) {
      setStripePromise(loadStripe(stripePublishableKey));
    }
  }, [dispatch, stripePublishableKey]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Container h={'90vh'} p="16">
      <Heading children="Welcome" my="8" textAlign={'center'} />
      <VStack
        boxShadow={'lg'}
        alignItems="stretch"
        borderRadius={'lg'}
        spacing="0"
      >
        <Box bg={'yellow.400'} p="4" css={{ borderRadius: '8px 8px 0 0' }}>
          <Text color={'black'} children={`Pro Pack - Rs.499.00`} />
        </Box>

        <Box p="4">
          <VStack textAlign={'center'} px="8" mt={'4'} spacing="8">
            <Text children={`Join Pro Pack and get access to all content!`} />
            <Heading size={'md'} children="Rs.499 Only" />
          </VStack>

          <Button onClick={onOpen} my={'8'} w="full" colorScheme={'yellow'}>
            <Text color={'black'} children={`Subscribe`} />
          </Button>
        </Box>

        <Box bg={'blackAlpha.600'} p="4" css={{ borderRadius: '0 0 8px 8px' }}>
          <Heading
            color={'white'}
            textTransform="uppercase"
            size={'sm'}
            children={'100% Refund At Cancellation'}
          />

          <Text
            fontSize={'xs'}
            color="white"
            children={'*Terms & Conditions Apply'}
          />
        </Box>
      </VStack>
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            isOpen={isOpen}
            onClose={onClose}
            dispatch={dispatch}
            createSubscription={createSubscription}
            navigate={navigate}
          />
        </Elements>
      )}
    </Container>
  );
};

export default Subscribe;

function PaymentForm({
  isOpen,
  onClose,
  dispatch,
  createSubscription,
  navigate,
}) {
  const {
    user: { name: userName, email: userEmail },
  } = useSelector(state => state.user);

  const { error, message, loading } = useSelector(state => state.payment);

  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);

  const stripe = useStripe();
  const elements = useElements();

  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const createSubscriptionHandler = async e => {
    e.preventDefault();

    try {
      const paymentMethod = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (paymentMethod.error) {
        console.log(paymentMethod.error);
      }

      await dispatch(
        createSubscription({
          name,
          email,
          paymentMethod: paymentMethod.paymentMethod.id,
          stripe,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        iconColor: isDark ? '#fff' : '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
      navigate('/payment-success');
    }
  }, [dispatch, error, message, navigate]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onClose()}>
        <ModalOverlay backdropFilter={'blur(10px)'} />
        <ModalContent>
          <ModalHeader>Pro Plan Purchase</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Container>
              <form
                style={{ minWidth: '100%' }}
                onSubmit={createSubscriptionHandler}
              >
                <VStack spacing={'8'}>
                  <HStack>
                    <RiSecurePaymentFill />
                    <Heading
                      size={'xs'}
                      fontFamily="sans-serif"
                      textTransform={'uppercase'}
                      children={'Payment is secured by Stripe'}
                    />
                  </HStack>
                  <VStack w={'full'}>
                    <Input
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your Name"
                      type={'text'}
                      focusBorderColor={'yellow.500'}
                    />

                    <Input
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Your Email"
                      type={'email'}
                      focusBorderColor={'yellow.500'}
                    />

                    <div
                      style={{
                        width: '100%',
                      }}
                    >
                      <CardElement
                        options={cardStyle}
                        className={
                          isDark ? 'StripeElement dark' : 'StripeElement'
                        }
                      />
                    </div>

                    <Text fontSize={'xs'} color="gray.500">
                      *Card details are not stored on our servers
                    </Text>

                    <HStack w="full"></HStack>
                  </VStack>

                  <Button
                    isLoading={loading}
                    w="full"
                    colorScheme={'yellow'}
                    type={'submit'}
                  >
                    Pay now - Rs. 500
                  </Button>
                </VStack>
              </form>
            </Container>
          </ModalBody>

          <ModalFooter>
            <Button mr={'3'} onClick={() => onClose()}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
