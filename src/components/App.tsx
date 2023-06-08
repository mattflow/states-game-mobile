import {
  TextInput,
  Text,
  Pressable,
  View,
  Alert,
  useColorScheme,
} from "react-native";
import {
  stateAbbreviationNameMap,
  stateAbbreviationSet,
  stateNameAbbreviationMap,
  stateNameSet,
  stateAbbreviationDimensionMap,
} from "../lib/states";
import useSet from "../lib/use-set";
import { useState, useEffect } from "react";
import { titleCase } from "title-case";
import { Path, G, Svg } from "react-native-svg";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const TIMEOUT_MS = 1250;
const INNER_TIMEOUT_MS = TIMEOUT_MS;
type Status =
  | "empty"
  | "typing"
  | "is a state"
  | "not a state"
  | "guessed already"
  | "checking"
  | "correct";

function getStateAbbreviation(stateNameOrAbbreviation: string) {
  if (stateAbbreviationSet.has(stateNameOrAbbreviation)) {
    return stateNameOrAbbreviation;
  }
  if (stateNameSet.has(stateNameOrAbbreviation)) {
    return stateNameAbbreviationMap.get(stateNameOrAbbreviation);
  }
  return null;
}

export default function App() {
  const colorSchema = useColorScheme();
  const [guess, setGuess] = useState("");
  const [guessed, { has: guessedHas, add: guessedAdd, reset: guessedReset }] =
    useSet<string>();
  const remaining = [...stateAbbreviationSet].filter(
    (abbreviation) => !guessedHas(abbreviation)
  );
  const [status, setStatus] = useState<Status>("empty");
  const trimmedGuess = guess.trim();
  const [stateName, setStateName] = useState<string | undefined>();
  const [cheat, setCheat] = useState(false);
  useEffect(() => {
    setStatus("typing");
    if (trimmedGuess === "") {
      setStatus("empty");
      return;
    }

    let innerTimeout: NodeJS.Timeout | undefined;
    const timeout = setTimeout(() => {
      const stateAbbreviation = getStateAbbreviation(trimmedGuess);
      if (!stateAbbreviation) {
        setStatus("not a state");
      } else if (guessedHas(stateAbbreviation)) {
        setStatus("guessed already");
      } else {
        setStatus("correct");
        setStateName(stateAbbreviationNameMap.get(stateAbbreviation));
        innerTimeout = setTimeout(() => {
          setGuess("");
          guessedAdd(stateAbbreviation);
        }, INNER_TIMEOUT_MS);
      }
    }, TIMEOUT_MS);

    return () => {
      clearTimeout(innerTimeout);
      clearTimeout(timeout);
    };
  }, [guess]);
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Color scheme: {colorSchema}</Text>
        <Pressable
          onPress={() => {
            Alert.alert("Reset", "Are you sure?", [
              {
                text: "No",
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: guessedReset,
              },
            ]);
          }}
        >
          <Text>Reset</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setCheat(!cheat);
          }}
        >
          <Text>Cheat</Text>
        </Pressable>
        <View>
          <View>
            <Text style={{ color: "#36d399", fontWeight: "600" }}>
              Guessed: {guessed.size}
            </Text>
            <Text style={{ color: "#f87272", fontWeight: "600" }}>
              Remaining: {remaining.length}
            </Text>
          </View>
        </View>
        <TextInput
          autoCorrect={false}
          autoComplete="off"
          autoCapitalize="characters"
          value={guess}
          onChangeText={(newGuess) => {
            setGuess(newGuess.toUpperCase());
          }}
        />
        <Text>
          {status === "correct" && stateName
            ? titleCase(stateName.toLowerCase())
            : status === "guessed already"
            ? "Drink"
            : status === "not a state"
            ? "Not a state"
            : ""}
        </Text>
        {cheat && (
          <View>
            <Svg viewBox="0 0 959 593">
              <G>
                {[...stateAbbreviationSet].map((abbreviation) => {
                  return (
                    <Path
                      fill={guessedHas(abbreviation) ? "#36d399" : "#ccc"}
                      key={abbreviation}
                      d={stateAbbreviationDimensionMap.get(abbreviation)}
                    ></Path>
                  );
                })}
              </G>
            </Svg>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
