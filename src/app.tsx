import { useEffect, useState } from "react";
import {
  TextInput,
  View,
  SafeAreaView,
  Text,
  Keyboard,
  Button,
} from "react-native";
import { isState, getStateName, stateNameSet } from "./states";

export default function App() {
  const [guess, setGuess] = useState("");
  const [guessed, setGuessed] = useState<Set<string>>(new Set());

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (isState(guess)) {
      timeoutId = setTimeout(() => {
        const stateName = getStateName(guess);
        if (!guessed.has(stateName)) {
          setGuessed(new Set([...guessed, stateName]));
          setGuess("");
        }
      }, 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [guess, guessed]);

  const remaining = new Set(
    [...stateNameSet].filter((name) => !guessed.has(name))
  );

  return (
    <SafeAreaView>
      <View
        style={{
          paddingHorizontal: 10,
          paddingTop: 25,
        }}
      >
        <Text>
          Remaining: {remaining.size} Guessed: {guessed.size}
        </Text>
        <TextInput
          style={{
            borderColor: "#d1d5db",
            borderWidth: 1,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 15,
            fontSize: 24,
          }}
          placeholder="Guess here..."
          value={guess}
          onChangeText={(text) => {
            setGuess(text.toUpperCase());
          }}
          onBlur={() => {
            Keyboard.dismiss();
          }}
          autoCapitalize="characters"
          autoCorrect={false}
          spellCheck={false}
        />
        {guess.trim() !== "" && (
          <Text>
            {isState(guess)
              ? `Is a state: ${getStateName(guess)}`
              : "Not a state"}
          </Text>
        )}
        <Button
          onPress={() => {
            setGuessed(new Set());
          }}
          title="RESET"
        />
      </View>
    </SafeAreaView>
  );
}
