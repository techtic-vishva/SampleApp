import { StyleSheet, Share, Platform } from "react-native";
import { View, Text, KeyboardAvoidingView } from "../../components/Themed";
import { GroupTabScreenProps } from "../../types";
import OrangeButton from "../../components/OrangeButton";
import React, { useEffect, useState } from "react";
import { chattanoogaTapWater, fill } from "../../constants/Colors";
import { useGroup } from "../../core/services/group";
import Loading from "../../components/Loading";
import { HeaderText } from "../../components/StyledText";
import { codeToRole, UserInviteForm } from "../../components/UserInviteForm";
import { houseHoldInvite } from "../../core/services/user";
import goBackOrHome from "../../navigation/goBackOrHome";
import SharedStyles from "../../constants/Styles";

export default function InviteGroupScreen({
  navigation,
  route,
}: GroupTabScreenProps<"GroupInvite">) {
  const groupId = route.params.groupId;
  const { data } = useGroup(groupId);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<{ label?: string; value?: string }>(
    {}
  );

  function next() {
    Share.share({
      message: `Join my group "${data?.name}" on Aro with invite code: ${data?.inviteCode} or click to join:\nhttps://applink.example.com/group/join/${data?.inviteCode}`,
    });
  }

  const onFormChange = ({
    name,
    email,
    role,
  }: {
    name?: string;
    email?: string;
    role?: string;
  }) => {
    if (typeof name === "string") setName(name);
    if (typeof email === "string") setEmail(email);
    if (typeof role === "string")
      setSelected({ value: role, label: codeToRole(role)?.value });
  };

  const onInvite = async () => {
    if (!name || !selected?.value || !email) return;

    await houseHoldInvite([{ name, email, role: selected.value }], "household");
    goBackOrHome(navigation);
  };

  useEffect(() => {
    // Hide header if household
    if (data?.type === "household") {
      navigation.setOptions({ title: "" });
    }
  }, [data]);

  if (!data) return <Loading />;

  if (data?.type !== "household") {
    return (
      <View style={styles.container}>
        <HeaderText style={styles.title}>{data.name}</HeaderText>
        <Text style={{ width: "70%", fontSize: 18, textAlign: "center" }}>
          Share this code to invite others to join your group in Aro.
        </Text>

        <View
          style={{
            width: "90%",
            borderColor: chattanoogaTapWater,
            borderWidth: 1,
            padding: 14,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 50,
          }}
        >
          <Text style={{ color: chattanoogaTapWater, fontSize: 20 }}>
            {data?.inviteCode}
          </Text>
        </View>

        <OrangeButton
          title="Share Code"
          outterStyle={{ width: "90%", marginTop: 50 }}
          onPress={next}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: 80 }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ width: "100%", alignItems: "center", marginBottom: 30 }}>
        <HeaderText style={styles.title}>Let's invite your family.</HeaderText>
        <Text style={{ width: "85%", fontSize: 18, textAlign: "center" }}>
          We'll send an invite to your family to join your Aro household.
        </Text>
      </View>

      <UserInviteForm
        name={name}
        email={email}
        role={selected.value}
        onFormChange={onFormChange}
      />
      <OrangeButton
        title="Send Invite"
        onPress={onInvite}
        outterStyle={[styles.button, { marginBottom: 30 }]}
        icon="send"
      />
      <View style={SharedStyles.glowTop} />
      <View style={SharedStyles.glowBottom} />
    </KeyboardAvoidingView>
  );
}

const width = "90%";

const styles = StyleSheet.create({
  input: {
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
    fontSize: 25,
    marginBottom: 10,
  },
  button: {
    marginTop: "auto",
    marginBottom: 50,
    width,
  },
});
