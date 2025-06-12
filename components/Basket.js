import {
  Button,
  Description,
  Image,
  Modal,
  Row,
  Text,
  Spacer,
  Fieldset,
  Grid,
  Divider,
  Card,
  Tooltip,
  Note,
  Radio,
} from "@geist-ui/react";

import Manager from "../lib/CartManager";
import { NotificationCenter } from "@arguiot/broadcast.js";
import pStyles from "../styles/ProductCard.module.scss";
import animationData from "../lotties/checkout.json";

import { useRouter } from "next/router";
import Locales from "../locales/Basket";
import { getDescription, getSize } from "../locales/Fuse";
import { Minus, Plus } from "@geist-ui/react-icons";
import React from "react";
import { DELIVERY_PRICE } from "../lib/Parameters";
import { useConfig } from "../pages/_app";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

export default function Basket({ bindings }) {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  NotificationCenter.default.addObserver(
    "newItem",
    (data) => {
      forceUpdate();
    },
    "Basket"
  );

  const router = useRouter();
  const t = Object.fromEntries(
    Object.entries(Locales).map((line) => [
      line[0],
      line[1][router.locale.split("-")[0]],
    ])
  );
  const [delivery, setDelivery] = React.useState(true);
  const [checkout, setCheckout] = React.useState(false);
  const [stock, setStock] = React.useState(false);

  const config = useConfig();

  const handleClick = async (event) => {
    setCheckout(true);
    // Verify if website isn't locked
    if (config.locked) {
      setCheckout(false);
      setStock(false);
      // Redirect to popup page
      router.push("/popup?locked=true");
      return;
    }

    const available = await Manager.checkAvailability();
    if (available != true) {
      setCheckout(false);
      setStock(available);
      return;
    }

    const Stripe = await import("@stripe/stripe-js");
    const stripePromise = Stripe.loadStripe(process.env.STRIPE_PUBLIC);

    const stripe = await stripePromise;

    const response = await fetch("/api/create-session", {
      method: "POST",
      body: JSON.stringify({
        cart: Manager.cart,
        delivery,
      }),
    });

    const session = await response.json();

    if (session.error) {
      setCheckout(session.error);
      return;
    }

    setCheckout(false);
    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
      setCheckout(result.error.message);
    }
  };

  if (typeof checkout == "string") {
    return (
      <Modal
        {...bindings}
        onClose={() => {
          setCheckout(false);
          bindings.onClose();
        }}
      >
        <Modal.Title>{t.checkoutErrorTitle}</Modal.Title>
        <Modal.Subtitle>{t.checkoutErrorSubTitle}</Modal.Subtitle>
        <Modal.Content>
          <Text align="center">{checkout}</Text>
        </Modal.Content>
      </Modal>
    );
  }

  if (Manager.numberOfItems == 0) {
    return (
      <Modal {...bindings}>
        <Modal.Title>{t.basket}</Modal.Title>
        <Modal.Subtitle>{t.empty}</Modal.Subtitle>
        <Modal.Content>
          <Text align="center">{t.emptyMsg}</Text>
        </Modal.Content>
      </Modal>
    );
  }

  const deliveryPrice =
    Manager.subtotal >= config.freeShipping ? 0 : DELIVERY_PRICE;

  const fieldset = (product) => (
    <Fieldset>
      <Fieldset.Content>
        <Grid.Container gap={1} justify="center">
          <Grid xs={7}>
            <Image
              src={`https://images.masecondecabane.com/${product.image}?auto=compress&w=150&h=150&fit=crop`}
              height={100}
              className={pStyles.img}
            />
          </Grid>
          <Grid xs={13}>
            <Text h5>{product.name}</Text>
            <Text p className={pStyles.truncate}>
              {getDescription(product, router.locale)}
            </Text>
            <Description
              title={t.size}
              content={getSize(product.size, router.locale)}
            />
          </Grid>
          <Grid xs={4}>
            <Row align="middle" style={{ height: "100%" }}>
              <Text h5>{product.price}$</Text>
            </Row>
          </Grid>
        </Grid.Container>
      </Fieldset.Content>
      <Fieldset.Footer>
        <Fieldset.Footer.Status>
          <Row align="middle">
            {t.quantity}:
            <Button
              auto
              type="abort"
              size="small"
              iconRight={<Minus />}
              onClick={() => Manager.decrement(product)}
            />
            {product.quantity}
            <Button
              auto
              type="abort"
              size="small"
              iconRight={<Plus />}
              onClick={() => Manager.increment(product)}
            />
          </Row>
        </Fieldset.Footer.Status>
        <Fieldset.Footer.Actions>
          <Button
            auto
            size="mini"
            type="error"
            ghost
            onClick={() => Manager.removeProduct(product._id)}
          >
            {t.remove}
          </Button>
        </Fieldset.Footer.Actions>
      </Fieldset.Footer>
    </Fieldset>
  );

  const modal = (
    <Modal width="80vw" {...bindings}>
      <Modal.Title>{t.basket}</Modal.Title>
      <Modal.Content>
        <Divider>{t.content}</Divider>
        {stock && (
          <Text align="center" type="error">
            {t.checkoutErrorMessage}
          </Text>
        )}
        <Grid.Container gap={2} justify="flex-start">
          {Manager.cart.map((product) => {
            return (
              <Grid xs={24} md={12} key={product._id}>
                {stock && product._id == stock._id ? (
                  <Tooltip
                    text={t.noStock}
                    visible
                    type="error"
                    style={{ width: "100%" }}
                  >
                    {fieldset(product)}
                  </Tooltip>
                ) : (
                  fieldset(product)
                )}
                <Spacer y={0.8} />
              </Grid>
            );
          })}
        </Grid.Container>
        <Divider>{t.total}</Divider>
        <Card>
          <Row justify="space-between">
            <Text b>{t.subtotal}</Text>
            <Text b>
              {(Math.round(Manager.subtotal * 100) / 100).toFixed(2)} CAD$
            </Text>
          </Row>
          <Row justify="space-between">
            <Text b>{t.gst}</Text>
            <Text b>
              {(Math.round(Manager.subtotal * 0.05 * 100) / 100).toFixed(2)}{" "}
              CAD$
            </Text>
          </Row>
          <Row justify="space-between">
            <Text b>{t.qst}</Text>
            <Text b>
              {(Math.round(Manager.subtotal * 0.09975 * 100) / 100).toFixed(2)}{" "}
              CAD$
            </Text>
          </Row>
          <Divider />
          <Radio.Group value={delivery} onChange={setDelivery}>
            <Radio value={true}>
              {t.delivery} ({deliveryPrice.toFixed(2)} CAD$)
              <Radio.Description>{t.deliveryDesc}</Radio.Description>
            </Radio>
            <Radio value={false}>
              {t.clickAndCollect}
              <Radio.Description>{t.clickDesc}</Radio.Description>
            </Radio>
          </Radio.Group>
          <Divider />
          <Row justify="space-between">
            <Text b>{t.total}</Text>
            <Text b>
              {(
                Math.round(
                  (Manager.subtotal * 1.14975 +
                    (delivery ? deliveryPrice : 0)) *
                    100
                ) / 100
              ).toFixed(2)}{" "}
              CAD$
            </Text>
          </Row>
        </Card>
        <Spacer y={1} />
        <Note>{t.delay}</Note>
        <Spacer y={1} />
        <Grid.Container gap={2} justify="flex-end">
          <Grid xs={24} md={7}>
            <Button
              onClick={() => bindings.onClose()}
              style={{ textTransform: "none", width: "100%" }}
            >
              {t.continue}
            </Button>
          </Grid>
          <Grid xs={24} md={7}>
            <Button
              shadow
              type="secondary"
              onClick={handleClick}
              style={{ textTransform: "none", width: "100%" }}
            >
              {t.checkout}
            </Button>
          </Grid>
        </Grid.Container>
      </Modal.Content>
    </Modal>
  );
  const loading = (
    <Modal
      width="80vw"
      {...bindings}
      onClose={() => {
        setCheckout(false);
        bindings.onClose();
      }}
    >
      <Modal.Title>{t.basket}</Modal.Title>
      <Modal.Content>
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          height={500}
          width={400}
          isClickToPauseDisabled={true}
        />
      </Modal.Content>
    </Modal>
  );
  return checkout ? loading : modal;
}
