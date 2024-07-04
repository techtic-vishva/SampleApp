import {
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";
import { HeaderText } from "../../components/StyledText";
import { View, Text, KeyboardAvoidingView } from "../../components/Themed";
import {
  AuthenticationTabScreenProps,
  OnboardingTabScreenProps,
} from "../../types";
import SharedStyles from "../../constants/Styles";
import OrangeButton from "../../components/OrangeButton";
import React, { useEffect, useState } from "react";
import { dichotomousHippopotamus, fill } from "../../constants/Colors";
import { openInbox } from "react-native-email-link";
import {
  loginWithLink,
  sendSignInLinkToEmail,
  signInDemoAccount,
} from "../../core/Authentication";

function InputStep({
  email,
  setEmail,
  next,
  trimmedEmail,
  verb,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  next: () => void;
  trimmedEmail: string;
  verb: string;
}) {
  return (
    <>
      <HeaderText style={styles.title}>What's your email?</HeaderText>
      <Text style={styles.tagline}>
        We'll send you a link to {verb} your account.
      </Text>
      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder="Email Address"
        style={styles.input}
        autoFocus={true}
        focusable={true}
        autoComplete="email"
        autoCapitalize="none"
        keyboardType="email-address"
      ></TextInput>
      <OrangeButton
        disabled={!trimmedEmail}
        onPress={next}
        outterStyle={styles.button}
        icon="arrow-right"
        title="Send Magic Link"
      />
    </>
  );
}

function ConfirmStep({ email, next }: { email: string; next: () => void }) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [link, setLink] = useState("");

  if (link && link.length > 10) {
    loginWithLink(link);
  }

  // Hidden Functionality for Simulator Deep Links
  async function onLongPressDoWork() {
    if (showLinkInput === false) {
      setShowLinkInput(true);
    } else {
      const link =
        "https://example.page.link/?link=https://aro-main.firebaseapp.com/__/auth/action?apiKey%3DAIzaSyA4uuQpWEfCmcHOFL1vfQHqVpaxDjzSujk%26mode%3DsignIn%26oobCode%3Dj29f27edtE3orJ5N5FOlhtSX0N6TRuHfXm3yJxO6jqQAAAGBg0h7EQ%26continueUrl%3Dhttps://example.page.link%26lang%3Den&ibi=com.aro.mobile.dev&ifl=https://aro-main.firebaseapp.com/__/auth/action?apiKey%3DAIzaSyA4uuQpWEfCmcHOFL1vfQHqVpaxDjzSujk%26mode%3DsignIn%26oobCode%3Dj29f27edtE3orJ5N5FOlhtSX0N6TRuHfXm3yJxO6jqQAAAGBg0h7EQ%26continueUrl%3Dhttps://example.page.link%26lang%3Den";
      loginWithLink(link);
    }
  }

  return (
    <>
      <HeaderText style={styles.title}>Check your email!</HeaderText>
      <Text style={styles.tagline}>We sent an email to you at:</Text>
      <Text style={[styles.tagline, { color: dichotomousHippopotamus }]}>
        {email}
      </Text>
      <Text style={styles.tagline}>
        It has a magic link that'll sign you in.
      </Text>
      <TextInput
        selectTextOnFocus={true}
        placeholder="Confirmation Link"
        value={link}
        onChangeText={setLink}
        autoFocus={true}
        style={[
          showLinkInput
            ? {
                backgroundColor: fill,
                color: "white",
                padding: 10,
                margin: 30,
                width: "90%",
              }
            : { display: "none" },
        ]}
      ></TextInput>
      <OrangeButton
        disabled={!email}
        onPress={() => {
          openInbox();
        }}
        outterStyle={[styles.button, { marginBottom: 20 }]}
        icon="mail"
        title="Open Mail App"
      />
      <TouchableOpacity onLongPress={onLongPressDoWork} onPress={next}>
        <Text style={{ paddingBottom: 20, textDecorationLine: "underline" }}>
          Try a Different Email
        </Text>
      </TouchableOpacity>
    </>
  );
}

enum Steps {
  Input,
  Confirm,
}

export default function EmailScreen({
  route,
  navigation,
}: AuthenticationTabScreenProps<"Email">) {
  const [email, setEmail] = useState(route.params?.email || "");
  const [trimmedEmail, setTrimmedEmail] = useState(email);
  const step = route.params?.step || Steps.Input;
  const verb = route.params?.verb || "access";

  useEffect(() => {
    setTrimmedEmail(email?.trim() || "");
  }, [email]);

  async function next() {
    if (step == Steps.Input) {
      if (trimmedEmail.toLowerCase() === "appdemo@goaro.com") {
        signInDemoAccount(trimmedEmail);
      } else {
        sendSignInLinkToEmail(trimmedEmail);
        navigation.push("Email", { step: Steps.Confirm, email: trimmedEmail });
      }
    } else if (step == Steps.Confirm) {
      navigation.replace("Email", {});
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {step == Steps.Input ? (
        <InputStep
          email={email}
          setEmail={setEmail}
          next={next}
          trimmedEmail={trimmedEmail}
          verb={verb}
        />
      ) : (
        <ConfirmStep email={email} next={next} />
      )}
      <View style={SharedStyles.glowTop} />
      <View style={SharedStyles.glowBottom} />
    </KeyboardAvoidingView>
  );
}

const width = "90%";

const styles = StyleSheet.create({
  input: {
    marginTop: "auto",
    width,
    backgroundColor: fill,
    padding: 14,
    fontSize: 18,
    borderRadius: 10,
    color: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 100,
    fontSize: 25,
    marginBottom: 10,
  },
  button: {
    marginTop: "auto",
    marginBottom: 50,
    width,
  },
  tagline: {
    fontSize: 18,
    fontWeight: "200",
  },
});
