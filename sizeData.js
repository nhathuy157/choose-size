const sizeData = {    products: {
        tshirt: {
            name: "Áo thun cổ tròn",
            icon: "👕",
            requiredMeasurements: ["height", "weight"],
            optionalMeasurements: ["chest"],
            sizeType: "letter", // S, M, L, etc.
            sizeChart: {
                male: [
                    { size: "S", height: { min: 155, max: 165 }, weight: { min: 45, max: 55 }, measurements: { chest: "92-96", length: "68-70" }},
                    { size: "M", height: { min: 160, max: 170 }, weight: { min: 50, max: 65 }, measurements: { chest: "96-100", length: "70-72" }},
                    { size: "L", height: { min: 165, max: 175 }, weight: { min: 60, max: 75 }, measurements: { chest: "100-104", length: "72-74" }},
                    { size: "XL", height: { min: 170, max: 180 }, weight: { min: 70, max: 85 }, measurements: { chest: "104-108", length: "74-76" }},
                    { size: "2XL", height: { min: 175, max: 185 }, weight: { min: 80, max: 95 }, measurements: { chest: "108-112", length: "76-78" }}
                ],
                female: [
                    { size: "S", height: { min: 150, max: 160 }, weight: { min: 40, max: 50 }, measurements: { chest: "84-88", length: "64-66" }},
                    { size: "M", height: { min: 155, max: 165 }, weight: { min: 45, max: 55 }, measurements: { chest: "88-92", length: "66-68" }},
                    { size: "L", height: { min: 160, max: 170 }, weight: { min: 50, max: 65 }, measurements: { chest: "92-96", length: "68-70" }},
                    { size: "XL", height: { min: 165, max: 175 }, weight: { min: 60, max: 75 }, measurements: { chest: "96-100", length: "70-72" }}
                ]
            }
        },        dress_pants: {
            name: "Quần tây",
            icon: "👖",
            requiredMeasurements: ["height", "weight"],
            optionalMeasurements: ["waist", "hip"],
            sizeType: "numeric", // 28, 29, 30, etc.
            sizeChart: {
                male: [
                    { size: "28", measurements: { waist: 71, hip: 88, thigh: 54, length: 98, leg: 15 }},
                    { size: "29", measurements: { waist: 74, hip: 90, thigh: 55, length: 99, leg: 15.5 }},
                    { size: "30", measurements: { waist: 76, hip: 92, thigh: 56, length: 100, leg: 16 }},
                    { size: "31", measurements: { waist: 79, hip: 94, thigh: 57, length: 101, leg: 16.5 }},
                    { size: "32", measurements: { waist: 81, hip: 96, thigh: 58, length: 102, leg: 17 }},
                    { size: "33", measurements: { waist: 84, hip: 98, thigh: 59, length: 103, leg: 17.5 }},
                    { size: "34", measurements: { waist: 86, hip: 100, thigh: 60, length: 104, leg: 18 }}
                ],
                female: [
                    { size: "26", measurements: { waist: 66, hip: 86, thigh: 52, length: 94, leg: 14 }},
                    { size: "27", measurements: { waist: 69, hip: 88, thigh: 53, length: 95, leg: 14.5 }},
                    { size: "28", measurements: { waist: 71, hip: 90, thigh: 54, length: 96, leg: 15 }},
                    { size: "29", measurements: { waist: 74, hip: 92, thigh: 55, length: 97, leg: 15.5 }},
                    { size: "30", measurements: { waist: 76, hip: 94, thigh: 56, length: 98, leg: 16 }}
                ]
            }
        },        polo: {
            name: "Áo Polo",
            icon: "👕",
            requiredMeasurements: ["height", "weight"],
            optionalMeasurements: ["chest"],
            sizeType: "letter",
            sizeChart: {
                male: [
                    { size: "S", height: { min: 155, max: 165 }, weight: { min: 45, max: 55 }, measurements: { chest: "94-98", length: "69-71" }},
                    { size: "M", height: { min: 160, max: 170 }, weight: { min: 50, max: 65 }, measurements: { chest: "98-102", length: "71-73" }},
                    { size: "L", height: { min: 165, max: 175 }, weight: { min: 60, max: 75 }, measurements: { chest: "102-106", length: "73-75" }},
                    { size: "XL", height: { min: 170, max: 180 }, weight: { min: 70, max: 85 }, measurements: { chest: "106-110", length: "75-77" }},
                    { size: "2XL", height: { min: 175, max: 185 }, weight: { min: 80, max: 95 }, measurements: { chest: "110-114", length: "77-79" }}
                ],
                female: [
                    { size: "S", height: { min: 150, max: 160 }, weight: { min: 40, max: 50 }, measurements: { chest: "86-90", length: "65-67" }},
                    { size: "M", height: { min: 155, max: 165 }, weight: { min: 45, max: 55 }, measurements: { chest: "90-94", length: "67-69" }},
                    { size: "L", height: { min: 160, max: 170 }, weight: { min: 50, max: 65 }, measurements: { chest: "94-98", length: "69-71" }},
                    { size: "XL", height: { min: 165, max: 175 }, weight: { min: 60, max: 75 }, measurements: { chest: "98-102", length: "71-73" }}
                ]
            }
        },        shirt: {
            name: "Áo sơ mi",
            icon: "👔",
            requiredMeasurements: ["height", "weight"],
            optionalMeasurements: ["chest", "shoulder", "sleeve"],
            sizeType: "letter",
            sizeChart: {
                male: [
                    { size: "S", height: { min: 155, max: 165 }, weight: { min: 45, max: 55 }, measurements: { chest: "92-96", shoulder: "42-43", sleeve: "59-60" }},
                    { size: "M", height: { min: 160, max: 170 }, weight: { min: 50, max: 65 }, measurements: { chest: "96-100", shoulder: "43-44", sleeve: "60-61" }},
                    { size: "L", height: { min: 165, max: 175 }, weight: { min: 60, max: 75 }, measurements: { chest: "100-104", shoulder: "44-45", sleeve: "61-62" }},
                    { size: "XL", height: { min: 170, max: 180 }, weight: { min: 70, max: 85 }, measurements: { chest: "104-108", shoulder: "45-46", sleeve: "62-63" }},
                    { size: "2XL", height: { min: 175, max: 185 }, weight: { min: 80, max: 95 }, measurements: { chest: "108-112", shoulder: "46-47", sleeve: "63-64" }}
                ],
                female: [
                    { size: "S", height: { min: 150, max: 160 }, weight: { min: 40, max: 50 }, measurements: { chest: "84-88", shoulder: "35-36", sleeve: "55-56" }},
                    { size: "M", height: { min: 155, max: 165 }, weight: { min: 45, max: 55 }, measurements: { chest: "88-92", shoulder: "36-37", sleeve: "56-57" }},
                    { size: "L", height: { min: 160, max: 170 }, weight: { min: 50, max: 65 }, measurements: { chest: "92-96", shoulder: "37-38", sleeve: "57-58" }},
                    { size: "XL", height: { min: 165, max: 175 }, weight: { min: 60, max: 75 }, measurements: { chest: "96-100", shoulder: "38-39", sleeve: "58-59" }}
                ]
            }
        },        spa: {
            name: "Áo Spa",
            icon: "🧥",
            requiredMeasurements: ["height", "weight"],
            optionalMeasurements: ["chest", "shoulder"],
            sizeType: "letter",
            sizeChart: {
                male: [
                    { size: "S", height: { min: 155, max: 165 }, weight: { min: 45, max: 55 }, measurements: { chest: "98-102", shoulder: "43-44" }},
                    { size: "M", height: { min: 160, max: 170 }, weight: { min: 50, max: 65 }, measurements: { chest: "102-106", shoulder: "44-45" }},
                    { size: "L", height: { min: 165, max: 175 }, weight: { min: 60, max: 75 }, measurements: { chest: "106-110", shoulder: "45-46" }},
                    { size: "XL", height: { min: 170, max: 180 }, weight: { min: 70, max: 85 }, measurements: { chest: "110-114", shoulder: "46-47" }}
                ],
                female: [
                    { size: "S", height: { min: 150, max: 160 }, weight: { min: 40, max: 50 }, measurements: { chest: "88-92", shoulder: "35-36" }},
                    { size: "M", height: { min: 155, max: 165 }, weight: { min: 45, max: 55 }, measurements: { chest: "92-96", shoulder: "36-37" }},
                    { size: "L", height: { min: 160, max: 170 }, weight: { min: 50, max: 65 }, measurements: { chest: "96-100", shoulder: "37-38" }},
                    { size: "XL", height: { min: 165, max: 175 }, weight: { min: 60, max: 75 }, measurements: { chest: "100-104", shoulder: "38-39" }}
                ]
            }
        }
    },
    measurementLabels: {
        height: "Chiều cao (cm)",
        weight: "Cân nặng (kg)",
        waist: "Vòng eo (cm)",
        hip: "Vòng mông (cm)",
        chest: "Vòng ngực (cm)",
        shoulder: "Vai (cm)",
        thigh: "Vòng đùi (cm)",
        length: "Chiều dài (cm)",
        leg: "Ống quần (cm)",
        sleeve: "Tay áo (cm)",
        inseam: "Dài quần (cm)"
    },
    male: {
        tshirt: [
            { size: 'S', height: { min: 155, max: 165 }, weight: { min: 45, max: 55 } },
            { size: 'M', height: { min: 160, max: 170 }, weight: { min: 50, max: 65 } },
            { size: 'L', height: { min: 165, max: 175 }, weight: { min: 60, max: 75 } },
            { size: 'XL', height: { min: 170, max: 180 }, weight: { min: 70, max: 85 } },
            { size: 'XXL', height: { min: 175, max: 190 }, weight: { min: 80, max: 100 } }
        ],
        shirt: [
            {
                size: 'XS',
                sizeNumber: 36,
                measurements: {
                    length: 71,
                    shoulder: 42,
                    bust: 94,
                    waist: 88,
                    hip: 90,
                    armhole: 37,
                    sleeveLength: 59,
                    collar: 23,
                    collarStand: 6.5,
                    cuffWidth: 11,
                    cuffLength: 12.5,
                    placketWidth: 5.5,
                    bottomPlacket: 17.5
                }
            },
            {
                size: 'S',
                sizeNumber: 37,
                measurements: {
                    length: 72,
                    shoulder: 43,
                    bust: 98,
                    waist: 92,
                    hip: 96,
                    armhole: 38,
                    sleeveLength: 60,
                    collar: 24,
                    collarStand: 6.5,
                    cuffWidth: 11,
                    cuffLength: 12.5,
                    placketWidth: 5.5,
                    bottomPlacket: 17.5
                }
            },
            {
                size: 'M',
                sizeNumber: 38,
                measurements: {
                    length: 73,
                    shoulder: 44,
                    bust: 102,
                    waist: 96,
                    hip: 100,
                    armhole: 39,
                    sleeveLength: 61,
                    collar: 25,
                    collarStand: 6.5,
                    cuffWidth: 11,
                    cuffLength: 12.5,
                    placketWidth: 5.5,
                    bottomPlacket: 17.5
                }
            },
            {
                size: 'L',
                sizeNumber: 39,
                measurements: {
                    length: 74,
                    shoulder: 45,
                    bust: 106,
                    waist: 100,
                    hip: 104,
                    armhole: 40,
                    sleeveLength: 62,
                    collar: 26,
                    collarStand: 6.5,
                    cuffWidth: 11,
                    cuffLength: 12.5,
                    placketWidth: 5.5,
                    bottomPlacket: 17.5
                }
            },
            {
                size: 'XL',
                sizeNumber: 40,
                measurements: {
                    length: 75,
                    shoulder: 46,
                    bust: 110,
                    waist: 104,
                    hip: 108,
                    armhole: 41,
                    sleeveLength: 63,
                    collar: 26,
                    collarStand: 6.5,
                    cuffWidth: 11.5,
                    cuffLength: 13,
                    placketWidth: 5.5,
                    bottomPlacket: 18
                }
            },
            {
                size: '2XL',
                sizeNumber: 41,
                measurements: {
                    length: 76,
                    shoulder: 47,
                    bust: 114,
                    waist: 108,
                    hip: 112,
                    armhole: 42,
                    sleeveLength: 64,
                    collar: 27,
                    collarStand: 6.5,
                    cuffWidth: 11.5,
                    cuffLength: 13,
                    placketWidth: 5.5,
                    bottomPlacket: 18
                }
            },
            {
                size: '3XL',
                sizeNumber: 42,
                measurements: {
                    length: 77,
                    shoulder: 48,
                    bust: 118,
                    waist: 112,
                    hip: 116,
                    armhole: 43,
                    sleeveLength: 65,
                    collar: 27,
                    collarStand: 6.5,
                    cuffWidth: 11.5,
                    cuffLength: 13,
                    placketWidth: 5.5,
                    bottomPlacket: 18
                }
            },
            {
                size: '4XL',
                sizeNumber: 43,
                measurements: {
                    length: 78,
                    shoulder: 49,
                    bust: 122,
                    waist: 116,
                    hip: 120,
                    armhole: 44,
                    sleeveLength: 66,
                    collar: 28,
                    collarStand: 6.5,
                    cuffWidth: 11.5,
                    cuffLength: 13,
                    placketWidth: 5.5,
                    bottomPlacket: 18
                }
            }
        ],        dress_pants: [
            { 
                size: '29', 
                sizeNumber: 29,
                measurements: {
                    length: 98,        // Dài quần
                    waist: 76,         // Vòng eo
                    hip: 91,           // Vòng mông (lưng xuống 18cm)
                    thigh: 54,         // Vòng đùi (cách đáy 5cm)
                    bottom: 61,        // Vòng đáy
                    leg: 17,           // Ống
                    note: "Quần lưng dưới rốn"
                }
            },
            { 
                size: '30',
                sizeNumber: 30,
                measurements: {
                    length: 98,
                    waist: 79,
                    hip: 94,
                    thigh: 56,
                    bottom: 62,
                    leg: 17,
                    note: "Quần lưng dưới rốn"
                }
            },
            { 
                size: '31',
                sizeNumber: 31,
                measurements: {
                    length: 99,
                    waist: 82,
                    hip: 97,
                    thigh: 58,
                    bottom: 63.5,
                    leg: 18,
                    note: "Quần lưng dưới rốn"
                }
            },
            { 
                size: '32',
                sizeNumber: 32,
                measurements: {
                    length: 99,
                    waist: 85,
                    hip: 100,
                    thigh: 60,
                    bottom: 65,
                    leg: 18,
                    note: "Quần lưng dưới rốn"
                }
            },
            { 
                size: '33',
                sizeNumber: 33,
                measurements: {
                    length: 100,
                    waist: 88,
                    hip: 103,
                    thigh: 62,
                    bottom: 66.5,
                    leg: 19,
                    note: "Quần lưng dưới rốn"
                }
            },
            { 
                size: '34',
                sizeNumber: 34,
                measurements: {
                    length: 100,
                    waist: 91,
                    hip: 106,
                    thigh: 64,
                    bottom: 68,
                    leg: 19,
                    note: "Quần lưng dưới rốn"
                }
            },
            { 
                size: '35',
                sizeNumber: 35,
                measurements: {
                    length: 101,
                    waist: 94,
                    hip: 109,
                    thigh: 66,
                    bottom: 69.5,
                    leg: 20,
                    note: "Quần lưng dưới rốn"
                }
            },
            { 
                size: '36',
                sizeNumber: 36,
                measurements: {
                    length: 101,
                    waist: 97,
                    hip: 112,
                    thigh: 68,
                    bottom: 71,
                    leg: 21,
                    note: "Quần lưng dưới rốn"
                }            }
        ],
        jacket: [
            { size: 'S', height: { min: 155, max: 165 }, weight: { min: 45, max: 55 } },
            { size: 'M', height: { min: 160, max: 170 }, weight: { min: 50, max: 65 } },
            { size: 'L', height: { min: 165, max: 175 }, weight: { min: 60, max: 75 } },
            { size: 'XL', height: { min: 170, max: 180 }, weight: { min: 70, max: 85 } },
            { size: 'XXL', height: { min: 175, max: 190 }, weight: { min: 80, max: 100 } }
        ],
        polo: [
            {
                size: 'XS',
                measurements: {
                    length: 61,
                    bust: 43,
                    shoulder: 43,
                    shoulderWidth: 37,
                    shortSleeveLength: 18,
                    longSleeveLength: 55,
                    collarSomi: 40,
                    collarTshirt: 40
                }
            },
            {
                size: 'S',
                measurements: {
                    length: 63.5,
                    bust: 45,
                    shoulder: 45,
                    shoulderWidth: 37,
                    shortSleeveLength: 19,
                    longSleeveLength: 56,
                    collarSomi: 40,
                    collarTshirt: 40
                }
            },
            {
                size: 'M',
                measurements: {
                    length: 66,
                    bust: 47,
                    shoulder: 47,
                    shoulderWidth: 38.5,
                    shortSleeveLength: 20,
                    longSleeveLength: 57,
                    collarSomi: 42,
                    collarTshirt: 40
                }
            },
            {
                size: 'L',
                measurements: {
                    length: 68.5,
                    bust: 49,
                    shoulder: 49,
                    shoulderWidth: 40,
                    shortSleeveLength: 21,
                    longSleeveLength: 58,
                    collarSomi: 44,
                    collarTshirt: 40
                }
            },
            {
                size: 'XL',
                measurements: {
                    length: 71,
                    bust: 51,
                    shoulder: 51,
                    shoulderWidth: 41.5,
                    shortSleeveLength: 22,
                    longSleeveLength: 59,
                    collarSomi: 46,
                    collarTshirt: 44
                }
            },
            {
                size: '2XL',
                measurements: {
                    length: 73.5,
                    bust: 53,
                    shoulder: 53,
                    shoulderWidth: 43,
                    shortSleeveLength: 23,
                    longSleeveLength: 60,
                    collarSomi: 48,
                    collarTshirt: 44
                }
            },
            {
                size: '3XL',
                measurements: {
                    length: 76,
                    bust: 55,
                    shoulder: 55,
                    shoulderWidth: 45,
                    shortSleeveLength: 24,
                    longSleeveLength: 61,
                    collarSomi: 50,
                    collarTshirt: 44
                }
            },
            {
                size: '4XL',
                measurements: {
                    length: 76,
                    bust: 57,
                    shoulder: 57,
                    shoulderWidth: 46.5,
                    shortSleeveLength: 24,
                    longSleeveLength: 62,
                    collarSomi: 52,
                    collarTshirt: 44
                }
            },
            {
                size: '5XL',
                measurements: {
                    length: 76,
                    bust: 59,
                    shoulder: 59,
                    shoulderWidth: 48,
                    shortSleeveLength: 24,
                    longSleeveLength: 63,
                    collarSomi: 54,
                    collarTshirt: 44
                }
            }
        ],
        spa: [
            {
                size: 'S',
                measurements: {
                    length: 68,
                    bust: 50,
                    waist: 47,
                    bottom: 51,
                    shoulderWidth: 43,
                    sleeveLength: 20,
                    collarWidth: 17.5
                }
            },
            {
                size: 'M',
                measurements: {
                    length: 70,
                    bust: 52,
                    waist: 49,
                    bottom: 53,
                    shoulderWidth: 44.5,
                    sleeveLength: 21,
                    collarWidth: 18
                }
            },
            {
                size: 'L',
                measurements: {
                    length: 72,
                    bust: 54,
                    waist: 51,
                    bottom: 55,
                    shoulderWidth: 46,
                    sleeveLength: 22,
                    collarWidth: 18.5
                }
            },
            {
                size: 'XL',
                measurements: {
                    length: 74,
                    bust: 56,
                    waist: 53,
                    bottom: 57,
                    shoulderWidth: 47.5,
                    sleeveLength: 23,
                    collarWidth: 19
                }
            },
            {
                size: '2XL',
                measurements: {
                    length: 76,
                    bust: 58,
                    waist: 55,
                    bottom: 59,
                    shoulderWidth: 49,
                    sleeveLength: 24,
                    collarWidth: 19.5
                }
            }
        ],
        round_neck_tshirt: [
            {
                size: 'XS',
                measurements: {
                    length: 61,
                    bust: 43,
                    shoulder: 43,
                    shoulderWidth: 37,
                    shortSleeveLength: 18,
                    longSleeveLength: 55
                }
            },
            {
                size: 'S',
                measurements: {
                    length: 63.5,
                    bust: 45,
                    shoulder: 45,
                    shoulderWidth: 37,
                    shortSleeveLength: 19,
                    longSleeveLength: 56
                }
            },
            {
                size: 'M',
                measurements: {
                    length: 66,
                    bust: 47,
                    shoulder: 47,
                    shoulderWidth: 38.5,
                    shortSleeveLength: 20,
                    longSleeveLength: 57
                }
            },
            {
                size: 'L',
                measurements: {
                    length: 68.5,
                    bust: 49,
                    shoulder: 49,
                    shoulderWidth: 40,
                    shortSleeveLength: 21,
                    longSleeveLength: 58
                }
            },
            {
                size: 'XL',
                measurements: {
                    length: 71,
                    bust: 51,
                    shoulder: 51,
                    shoulderWidth: 41.5,
                    shortSleeveLength: 22,
                    longSleeveLength: 59
                }
            },
            {
                size: '2XL',
                measurements: {
                    length: 73.5,
                    bust: 53,
                    shoulder: 53,
                    shoulderWidth: 43,
                    shortSleeveLength: 23,
                    longSleeveLength: 60
                }
            },
            {
                size: '3XL',
                measurements: {
                    length: 76,
                    bust: 55,
                    shoulder: 55,
                    shoulderWidth: 45,
                    shortSleeveLength: 24,
                    longSleeveLength: 61
                }
            },
            {
                size: '4XL',
                measurements: {
                    length: 76,
                    bust: 57,
                    shoulder: 57,
                    shoulderWidth: 46.5,
                    shortSleeveLength: 24,
                    longSleeveLength: 62
                }
            },
            {
                size: '5XL',
                measurements: {
                    length: 76,
                    bust: 59,
                    shoulder: 59,
                    shoulderWidth: 48,
                    shortSleeveLength: 24,
                    longSleeveLength: 63
                }
            }
        ],
    },
    female: {
        tshirt: [
            { size: 'S', height: { min: 150, max: 160 }, weight: { min: 40, max: 50 } },
            { size: 'M', height: { min: 155, max: 165 }, weight: { min: 45, max: 55 } },
            { size: 'L', height: { min: 160, max: 170 }, weight: { min: 50, max: 65 } },
            { size: 'XL', height: { min: 165, max: 175 }, weight: { min: 60, max: 75 } },
            { size: 'XXL', height: { min: 170, max: 180 }, weight: { min: 70, max: 85 } }
        ],
        shirt: [
            { 
                size: 'XS',
                measurements: {
                    length: 61,
                    shoulder: 35,
                    bust: 84,
                    waist: 68,
                    hip: 90
                }
            },
            {
                size: 'S',
                measurements: {
                    length: 62,
                    shoulder: 36,
                    bust: 88,
                    waist: 72,
                    hip: 94
                }
            },
            {
                size: 'M',
                measurements: {
                    length: 63,
                    shoulder: 37,
                    bust: 92,
                    waist: 76,
                    hip: 98
                }
            },
            {
                size: 'L',
                measurements: {
                    length: 64,
                    shoulder: 38,
                    bust: 96,
                    waist: 80,
                    hip: 102
                }
            },
            {
                size: 'XL',
                measurements: {
                    length: 65,
                    shoulder: 39,
                    bust: 100,
                    waist: 84,
                    hip: 106
                }
            },
            {
                size: '2XL',
                measurements: {
                    length: 66,
                    shoulder: 40,
                    bust: 104,
                    waist: 88,
                    hip: 110
                }
            },
            {
                size: '3XL',
                measurements: {
                    length: 67,
                    shoulder: 41,
                    bust: 108,
                    waist: 92,
                    hip: 114
                }
            },
            {
                size: '4XL',
                measurements: {
                    length: 68,
                    shoulder: 42,
                    bust: 112,
                    waist: 96,
                    hip: 118
                }
            },
            {
                size: '5XL',
                measurements: {
                    length: 69,
                    shoulder: 43,
                    bust: 116,
                    waist: 100,
                    hip: 122
                }
            }
        ],        dress_pants: [
            {
                size: '26',
                sizeNumber: 26,
                measurements: {
                    length: 95,        // Dài quần
                    waist: 64,         // Lưng (eo)
                    hip: 87,           // Vòng mông (lưng xuống 18cm)
                    thigh: 53,         // Vòng đùi (cách đáy 5cm)
                    leg: 14,           // Ống
                    bottom: 58.5,      // Vòng đáy
                    note: "Quần lưng cao"
                }
            },
            {
                size: '27',
                sizeNumber: 27,
                measurements: {
                    length: 95,
                    waist: 68,
                    hip: 91,
                    thigh: 55,
                    leg: 15,
                    bottom: 60,
                    note: "Quần lưng cao"
                }
            },
            {
                size: '28',
                sizeNumber: 28,
                measurements: {
                    length: 96,
                    waist: 72,
                    hip: 95,
                    thigh: 57,
                    leg: 16,
                    bottom: 61.5,
                    note: "Quần lưng cao"
                }
            },
            {
                size: '29',
                sizeNumber: 29,
                measurements: {
                    length: 96,
                    waist: 76,
                    hip: 99,
                    thigh: 59,
                    leg: 17,
                    bottom: 63,
                    note: "Quần lưng cao"
                }
            },
            {
                size: '30',
                sizeNumber: 30,
                measurements: {
                    length: 97,
                    waist: 80,
                    hip: 103,
                    thigh: 61,
                    leg: 18,
                    bottom: 64.5,
                    note: "Quần lưng cao"
                }
            },
            {
                size: '31',
                sizeNumber: 31,
                measurements: {
                    length: 97,
                    waist: 84,
                    hip: 107,
                    thigh: 63,
                    leg: 18,
                    bottom: 66,
                    note: "Quần lưng cao"
                }
            },
            {
                size: '32',
                sizeNumber: 32,
                measurements: {
                    length: 98,
                    waist: 88,
                    hip: 111,
                    thigh: 65,
                    leg: 19,
                    bottom: 67.5,
                    note: "Quần lưng cao"
                }
            },
            {
                size: '33',
                sizeNumber: 33,
                measurements: {
                    length: 98,
                    waist: 92,
                    hip: 115,
                    thigh: 67,
                    leg: 19,
                    bottom: 69,
                    note: "Quần lưng cao"
                }
            }
        ],
        jacket: [
            { size: 'S', height: { min: 150, max: 160 }, weight: { min: 40, max: 50 } },
            { size: 'M', height: { min: 155, max: 165 }, weight: { min: 45, max: 55 } },
            { size: 'L', height: { min: 160, max: 170 }, weight: { min: 50, max: 65 } },
            { size: 'XL', height: { min: 165, max: 175 }, weight: { min: 60, max: 75 } },
            { size: 'XXL', height: { min: 170, max: 180 }, weight: { min: 70, max: 85 } }
        ],
        spa: [
            {
                size: 'S',
                measurements: {
                    length: 60,
                    bust: 46,
                    waist: 39,
                    bottom: 50,
                    shoulderWidth: 35,
                    sleeveLength: 16,
                    collarWidth: 16
                }
            },
            {
                size: 'M',
                measurements: {
                    length: 62,
                    bust: 48,
                    waist: 41,
                    bottom: 52,
                    shoulderWidth: 36.5,
                    sleeveLength: 17,
                    collarWidth: 16.5
                }
            },
            {
                size: 'L',
                measurements: {
                    length: 64,
                    bust: 50,
                    waist: 43,
                    bottom: 54,
                    shoulderWidth: 38,
                    sleeveLength: 18,
                    collarWidth: 17
                }
            },
            {
                size: 'XL',
                measurements: {
                    length: 66,
                    bust: 52,
                    waist: 45,
                    bottom: 56,
                    shoulderWidth: 39.5,
                    sleeveLength: 19,
                    collarWidth: 17.5
                }
            },
            {
                size: '2XL',
                measurements: {
                    length: 68,
                    bust: 54,
                    waist: 47,
                    bottom: 58,
                    shoulderWidth: 41,
                    sleeveLength: 20,
                    collarWidth: 18
                }
            }
        ],
    }
};
