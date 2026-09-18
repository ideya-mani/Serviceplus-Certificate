String selected = "," + check.getValue().replace(" ", "") + ",";

// 1 - Residence Certificate
if (!selected.contains(",1,")) {
    mvelObject.removeAttribute(residence.getSpdiAttributeId());
}

// 2 - Residence 2B
if (!selected.contains(",2,")) {
    mvelObject.removeAttribute(residence2b.getSpdiAttributeId());
}

// 3 - Nativity Certificate
if (!selected.contains(",3,")) {
    mvelObject.removeAttribute(nativity.getSpdiAttributeId());
}

// 4 - Income Certificate
if (!selected.contains(",4,")) {
    mvelObject.removeAttribute(income.getSpdiAttributeId());
}

// 5 - EWS
if (!selected.contains(",5,")) {
    mvelObject.removeAttribute(ews.getSpdiAttributeId());
}

// 6 - EWS Central
if (!selected.contains(",6,")) {
    mvelObject.removeAttribute(ewsCentral.getSpdiAttributeId());
}

// 7 - SC Caste
if (!selected.contains(",7,")) {
    mvelObject.removeAttribute(scCaste.getSpdiAttributeId());
}

// 8 - SC Migrant
if (!selected.contains(",8,")) {
    mvelObject.removeAttribute(scMigrant.getSpdiAttributeId());
}

// 9 - ST Caste
if (!selected.contains(",9,")) {
    mvelObject.removeAttribute(stCaste.getSpdiAttributeId());
}

// 10 - ST Migrant
if (!selected.contains(",10,")) {
    mvelObject.removeAttribute(stMigrant.getSpdiAttributeId());
}

// 11 - BCM
if (!selected.contains(",11,")) {
    mvelObject.removeAttribute(bcm.getSpdiAttributeId());
}

// 12 - BT Caste
if (!selected.contains(",12,")) {
    mvelObject.removeAttribute(btCaste.getSpdiAttributeId());
}

// 13 - EBC
if (!selected.contains(",13,")) {
    mvelObject.removeAttribute(ebc.getSpdiAttributeId());
}

// 14 - MBC Study
if (!selected.contains(",14,")) {
    mvelObject.removeAttribute(mbcStudy.getSpdiAttributeId());
}

// 15 - MBC Employment
if (!selected.contains(",15,")) {
    mvelObject.removeAttribute(mbcEmployment.getSpdiAttributeId());
}

// 16 - OBC Study
if (!selected.contains(",16,")) {
    mvelObject.removeAttribute(obcStudy.getSpdiAttributeId());
}

// 17 - OBC Employment
if (!selected.contains(",17,")) {
    mvelObject.removeAttribute(obcEmployment.getSpdiAttributeId());
}

// 18 - OBC Migrant
if (!selected.contains(",18,")) {
    mvelObject.removeAttribute(obcMigrant.getSpdiAttributeId());
}

// 19 - OBC Central
if (!selected.contains(",19,")) {
    mvelObject.removeAttribute(obcCentral.getSpdiAttributeId());
}

// 20 - OBC Central Migrant
if (!selected.contains(",20,")) {
    mvelObject.removeAttribute(obcCentralMigrant.getSpdiAttributeId());
}

// 21 - Combined Certificate
if (!selected.contains(",21,")) {
    mvelObject.removeAttribute(combinedCertificate.getSpdiAttributeId());
}