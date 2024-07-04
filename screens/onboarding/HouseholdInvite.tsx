import { Share, StyleSheet } from "react-native";
import { HeaderText } from "../../components/StyledText";
import { View, Text } from "../../components/Themed";
import { OnboardingTabScreenProps } from "../../types";

import React, { useState } from "react";
import OrangeButton from "../../components/OrangeButton";
import {
  chattanoogaTapWater,
  dichotomousHippopotamus,
  fill,
} from "../../constants/Colors";
import { useUser } from "../../core/services/user";
import { Feather } from "@expo/vector-icons";

export default function HouseholdInvite({
  navigation,
}: OnboardingTabScreenProps<"HouseholdInvite">) {
  const { data } = useUser();

  function next() {
    navigation.navigate("Motivation");
  }

  function inviteUsers() {
    Share.share({
      message: `Join my household on Aro:\n\n1️⃣ Install the Aro app:\nhttps://applink.example.com/install\n\n2️⃣ Tap to join household:\nhttps://applink.example.com/a/${data?.householdInviteCode}\n\n-OR-\n\nUse activation code: ${data?.householdInviteCode}`,
    });
  }

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", alignItems: "center" }}>
        <Feather
          name="home"
          color={dichotomousHippopotamus}
          size={42}
          style={{ marginBottom: 20 }}
        />
        <HeaderText style={styles.title}>Invite Your Household</HeaderText>
      </View>
      <View style={{ width: "90%", display: "flex", flexDirection: "column" }}>
        <Text style={[styles.tagline, { marginBottom: 30 }]}>
          Invite others to join your Aro membership. Tap below to send an invite
          with details on how they can get started.
        </Text>
        <OrangeButton
          onPress={inviteUsers}
          title="Send Invite"
          icon="send"
          outterStyle={[styles.buttonInvite]}
        />
      </View>
      <View style={{ width: "90%", display: "flex", flexDirection: "column" }}>
        <Text
          style={[
            styles.tagline,
            { color: chattanoogaTapWater, marginBottom: 30 },
          ]}
        >
          Already have the app installed? Share your invite code to add others
          to your household:
        </Text>
        <View style={styles.innerContainer}>
          <Text selectable style={styles.txtCode}>
            {data?.householdInviteCode || "---"}
          </Text>
        </View>
      </View>
      <OrangeButton
        onPress={next}
        outterStyle={styles.buttonContinue}
        icon="arrow-right"
        title="Continue"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "30%",
    paddingBottom: "30%",
  },
  buttonInvite: {
    marginBottom: 35,
    width: "100%",
  },
  buttonContinue: {
    marginTop: 10,
    marginBottom: 30,
    width: "90%",
    position: "absolute",
    bottom: 0,
  },
  title: {
    fontSize: 25,
    marginBottom: 30,
  },
  tagline: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 17,
    textAlign: "center",
  },
  innerContainer: {
    backgroundColor: fill,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  txtCode: {
    textAlign: "center",
    fontFamily: "objektiv-semi-bold",
    fontSize: 18,
    color: "white",
  },
});
