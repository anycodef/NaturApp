// app/index.js — Punto de entrada: redirige al Tab principal
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
