// Lógica de recomendación para el clima de Medellín: Tropical Húmedo (22-28°C, buenas lluvias)

function analizarSueloYRecomendar(datosSuelo) {
  const { textura, humedad, color } = datosSuelo;

  let tipoSueloIdentificado = "No determinado";
  let cultivosSugeridos = [];
  let consejos = "";

  // 1. Identificar el tipo de suelo descriptivo
  if (textura && humedad && color) {
    let texturaDesc = textura.charAt(0).toUpperCase() + textura.slice(1);
    let humedadDesc = humedad.charAt(0).toUpperCase() + humedad.slice(1);
    let colorDesc = color.charAt(0).toUpperCase() + color.slice(1);
    tipoSueloIdentificado = `Suelo ${texturaDesc}, ${humedadDesc} y de Color ${colorDesc}`;
  } else {
    // Esta validación se hace en el controlador, pero es una salvaguarda.
    return {
      tipoSueloIdentificado: "Datos incompletos",
      cultivosSugeridos: [],
      consejos: "Por favor, proporciona textura, humedad y color del suelo."
    };
  }

  // 2. Lógica de recomendación de cultivos y consejos basada en la TEXTURA
  if (textura === 'arenoso') {
    cultivosSugeridos.push("Zanahorias", "Rábanos", "Papas", "Remolacha", "Batata", "Ajo", "Cebolla", "Tomillo", "Romero");
    consejos += 'Tu suelo es ligero y drena muy bien. Esto es ideal para tubérculos y raíces que necesitan espacio para crecer sin obstáculos. ';
    // Sub-lógica para la humedad en suelo arenoso
    if (humedad === 'seca') {
      consejos += 'Al ser seco, necesitará riego frecuente y ligero, ya que no retiene bien el agua ni los nutrientes. La adición constante de compost es crucial. ';
    } else { // humedad === 'humeda'
      consejos += 'Aunque retiene algo de humedad, sigue siendo propenso a secarse. Vigila el riego y considera usar acolchado (mulching) para conservar la humedad. ';
    }
  } else if (textura === 'limoso') {
    cultivosSugeridos.push("Lechugas (variedades diversas)", "Espinaca", "Acelga", "Brócoli", "Coliflor", "Cilantro", "Perejil", "Maíz", "Frijol");
    consejos += 'Tu suelo es fértil y suave, excelente para la mayoría de las hortalizas de hoja y legumbres. Su buena retención de agua es una ventaja en Medellín. ';
    // Sub-lógica para la humedad en suelo limoso
    if (humedad === 'humeda') {
      consejos += 'Ten cuidado de no compactarlo al trabajarlo mojado. Mantén la estructura con aportes regulares de compost. ';
    }
  } else if (textura === 'arcilloso') {
    cultivosSugeridos.push("Coles (repollo, brócoli)", "Puerro", "Apio", "Acelgas resistentes", "Berenjena");
    consejos += 'Tu suelo es rico en nutrientes pero pesado. El drenaje es tu principal desafío y prioridad. ';
    // Sub-lógica para la humedad en suelo arcilloso
    if (humedad === 'humeda') {
      cultivosSugeridos.push("Arroz (si puedes manejar inundación)");
      consejos += 'Al ser muy húmedo, es vital crear bancales elevados o mezclarlo con abundante compost grueso y fibra de coco para mejorar la aireación y evitar que las raíces se ahoguen. ';
    } else { // humedad === 'seca'
        consejos += 'Aunque se seca en la superficie, probablemente retiene humedad en profundidad. Mejora su estructura con compost para evitar que se agriete. ';
    }
  } else if (textura === 'franco') {
    cultivosSugeridos.push("Tomates", "Pimientos", "Pepinos", "Calabacín", "Habichuelas", "Fresas", "Casi cualquier hortaliza");
    consejos += '¡Tienes el suelo ideal! Es equilibrado, fértil y fácil de trabajar. Es apto para la gran mayoría de cultivos de huerto. ¡Aprovéchalo! ';
  }

  // 3. Consejos adicionales basados en el COLOR
  if (color === 'negro') {
    consejos += 'El color oscuro es un excelente indicador de alta materia orgánica y fertilidad. Sigue nutriéndolo con compost para mantenerlo así. ';
  } else if (color === 'claro') {
    consejos += 'Un color claro sugiere que puede ser bajo en materia orgánica. Será fundamental enriquecer tu tierra con compost, humus, bocashi y otros abonos orgánicos de forma regular. ';
  }
  
  // 4. Consejos generales para el clima de Medellín
  consejos += 'Recuerda que para el clima de Medellín, es importante asegurar un buen drenaje en épocas de lluvia y no descuidar el riego en las temporadas más secas. La mayoría de estos cultivos prosperarán todo el año. ';

  if (cultivosSugeridos.length === 0) {
      consejos = "Para esta combinación específica, no hay una recomendación clara. Te sugerimos mejorar tu suelo con abundante compost para acercarlo a una textura franca, que es ideal para la mayoría de los cultivos en Medellín.";
  }
  
  return {
    tipoSueloIdentificado,
    cultivosSugeridos,
    consejos
  };
}

module.exports = {
  analizarSueloYRecomendar
};