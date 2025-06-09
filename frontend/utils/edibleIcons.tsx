 import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
 
 export default  function edibleIcon(item: any) {
    if (!item.edible) return null;
    if (item.edible === "Edible") return <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="green" />;
    if (item.edible === "Inedible") return <Octicons name="no-entry" size={24} color="red" />;
    if (item.edible === "Poisonous") return <FontAwesome6 name="skull-crossbones" size={24} color="purple" />;
  }