import { Pressable, SafeAreaView, ScrollView, Text } from "react-native";
import { stateAbbreviationNameMap, stateAbbreviationSet } from "../lib/states";
import useSet from "../lib/use-set";
import { titleCase } from "title-case";

export default function App() {
  const [guessed, { has: guessedHas, add: guessedAdd, reset: guessedReset }] =
    useSet<string>();
  const remaining = [...stateAbbreviationSet].filter(
    (abbreviation) => !guessedHas(abbreviation)
  );
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>{guessed.size}</Text>
        {remaining.map((abbreviation) => (
          <Pressable
            key={abbreviation}
            onPress={() => guessedAdd(abbreviation)}
          >
            <Text>
              {titleCase(
                (
                  stateAbbreviationNameMap.get(abbreviation) as string
                ).toLowerCase()
              )}
            </Text>
          </Pressable>
        ))}
        <Pressable onPress={guessedReset}>
          <Text>RESET</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
