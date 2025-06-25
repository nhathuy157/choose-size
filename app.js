// State management
let selectedProduct = null;
const customSettings = {
    highlightBestMatch: true,
    showAllSizes: true,
    fitPreference: 'regular',
    bellyType: 'normal',
    modified: false
};

// Thêm function để kiểm tra mobile view
function isMobileView() {
    return window.innerWidth <= 768;
}

// Function để chuyển đổi section trên mobile
function switchToSection(sectionNumber) {
    if (!isMobileView()) return;

    const sections = [
        document.getElementById('productGrid'),
        document.getElementById('measurementForm'),
        document.querySelector('.result-section')
    ];

    sections.forEach((section, index) => {
        if (index + 1 === sectionNumber) {
            section.classList.add('active');
            section.style.display = 'block';
        } else {
            section.classList.remove('active');
            section.style.display = 'none';
        }
    });
}

// DOM Elements
const form = document.getElementById('sizeForm');
const result = document.getElementById('result');
const recommendedSize = document.getElementById('recommendedSize');
const sizeDetails = document.getElementById('sizeDetails');
const customizeBtn = document.getElementById('customizeBtn');
const customizeModal = document.getElementById('customizeModal');
const closeCustomizeBtn = document.getElementById('closeCustomize');
const productGrid = document.getElementById('productGrid');
const measurementForm = document.getElementById('measurementForm');

// Helper Functions
function getPreferenceText(preference) {
    const texts = {
        'loose': 'Thoải mái',
        'regular': 'Vừa vặn',
        'tight': 'Ôm sát'
    };
    return texts[preference] || preference;
}

function getBellyTypeText(bellyType) {
    const texts = {
        'flat': 'Phẳng',
        'normal': 'Bình thường',
        'round': 'Tròn'
    };
    return texts[bellyType] || bellyType;
}

// Main Functions
function handleProductSelection(productType) {
    selectedProduct = productType;
    const product = sizeData.products[productType];
    
    // Reset tất cả các input về rỗng
    const allInputs = document.querySelectorAll('#measurementInputs input');
    allInputs.forEach(input => {
        input.value = '';
    });
    
    // Reset các tùy chỉnh và kết quả
    customSettings.fitPreference = 'regular';
    customSettings.bellyType = 'normal';
    customSettings.modified = false;
    
    // Ẩn tất cả các phần kết quả và bảng size
    document.getElementById('result').classList.add('hidden');
    document.getElementById('alternativeResult').classList.add('hidden');
    document.querySelector('.size-reference').classList.add('hidden');
    
    // Reset các giá trị trong form tùy chỉnh
    document.getElementById('fitPreference').value = 'regular';
    document.getElementById('bellyType').value = 'normal';
    
    // Hiển thị form nhập liệu và đảm bảo nó không bị ẩn
    const measurementForm = document.getElementById('measurementForm');
    measurementForm.classList.remove('hidden');
    measurementForm.style.display = 'block';
    
    // Cập nhật thông tin sản phẩm đã chọn
    document.querySelector('.selected-product').style.display = 'flex';
    document.getElementById('selectedProductIcon').innerHTML = product.icon;
    document.getElementById('selectedProductName').textContent = product.name;
    document.getElementById('productType').value = productType;

    // Tạo các trường nhập liệu mới
    createMeasurementInputs(product);
    
    // Hiển thị bảng size mới
    displaySizeChart(productType);

    // Chuyển đến section 2 trên mobile
    if (isMobileView()) {
        switchToSection(2);
    }
}

function handleGenderChange() {
    if (selectedProduct) {
        displaySizeChart(selectedProduct);
        updateSizeChartHighlight();
        handleInputChange();
    }
}

function handleInputChange() {
    if (!selectedProduct) return;

    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    if (!gender) return;

    const product = sizeData.products[selectedProduct];
    const measurements = {};
    let isValid = true;

    // Kiểm tra các trường bắt buộc
    product.requiredMeasurements.forEach(measurement => {
        const value = parseFloat(document.getElementById(measurement)?.value);
        if (!value || isNaN(value)) {
            isValid = false;
            return;
        }
        measurements[measurement] = value;
    });

    // Thu thập các trường tùy chọn
    if (product.optionalMeasurements) {
        product.optionalMeasurements.forEach(measurement => {
            const value = parseFloat(document.getElementById(measurement)?.value);
            if (value && !isNaN(value)) {
                measurements[measurement] = value;
            }
        });
    }

    if (!isValid || !validateMeasurements(measurements)) return;

    updateSize(measurements, gender);

    // Chuyển đến section 3 trên mobile khi có kết quả
    if (isMobileView()) {
        switchToSection(3);
    }
}

function updateSize(measurements, gender) {
    const height = measurements.height;
    const weight = measurements.weight;
    const baseSize = findBaseSize(selectedProduct, gender, height, weight, measurements);
    
    // Debug logging
    console.log('Measurements:', measurements);
    console.log('Selected product:', selectedProduct);
    console.log('Gender:', gender);
    console.log('Base size found:', baseSize);
    
    if (!baseSize) {
        console.error('No base size found!');
        return;
    }

    const adjustedSize = adjustSize(baseSize, customSettings, selectedProduct);
    
    // Cập nhật kết quả chính (hiển thị size gốc)
    const result = document.getElementById('result');
    result.classList.remove('hidden');
    document.getElementById('recommendedSize').textContent = baseSize.size;

    // Hiển thị lại bảng size tham khảo
    document.querySelector('.size-reference').classList.remove('hidden');

    // Xóa tất cả highlight cũ
    document.querySelectorAll('.size-chart tr').forEach(row => {
        row.classList.remove('highlight', 'alternative-highlight');
    });

    // Highlight hàng của size gốc
    const baseRow = document.querySelector(`.size-chart tr[data-size="${baseSize.size}"]`);
    if (baseRow) {
        baseRow.classList.add('highlight');
    }

    // Xử lý size thay thế (hiển thị size đã điều chỉnh)
    const alternativeResult = document.getElementById('alternativeResult');
    
    console.log('Custom settings modified:', customSettings.modified);
    console.log('Adjusted size:', adjustedSize.size);
    console.log('Base size:', baseSize.size);
    
    // Kiểm tra có số đo chi tiết không
    const detailedMeasurements = Object.keys(measurements).filter(key => 
        key !== 'height' && key !== 'weight' && measurements[key]);
    const hasDetailedMeasurements = detailedMeasurements.length > 0;
    
    console.log('Detailed measurements used:', detailedMeasurements);
    
    // Kiểm tra có thay đổi về độ ôm/dáng bụng không
    const hasFitBellyChanges = (customSettings.fitPreference !== 'regular' || 
                               customSettings.bellyType !== 'normal');
    
    // Hiển thị kết quả thay thế khi:
    // 1. Có thay đổi độ ôm/dáng bụng, hoặc
    // 2. Có số đo chi tiết được nhập, hoặc  
    // 3. Size đã thay đổi so với gốc
    if (hasFitBellyChanges || hasDetailedMeasurements || adjustedSize.size !== baseSize.size) {
        alternativeResult.classList.remove('hidden');
        document.getElementById('alternativeSize').textContent = adjustedSize.size;

        // Highlight hàng của size thay thế với màu khác
        if (adjustedSize.size !== baseSize.size) {
            const adjustedRow = document.querySelector(`.size-chart tr[data-size="${adjustedSize.size}"]`);
            if (adjustedRow) {
                adjustedRow.classList.add('alternative-highlight');
            }
        }

        // Tạo giải thích
        let explanation = `Size ${baseSize.size} `;
        let changes = [];

        if (customSettings.fitPreference === 'loose') {
            changes.push('tăng 1 size do chọn độ ôm rộng');
        } else if (customSettings.fitPreference === 'tight') {
            changes.push('giảm 1 size do chọn độ ôm sát');
        }
        
        if (customSettings.bellyType === 'round') {
            changes.push('tăng 1 size do dáng bụng tròn');
        } else if (customSettings.bellyType === 'flat') {
            changes.push('giảm 1 size do dáng bụng phẳng');
        }

        if (changes.length > 0) {
            explanation += `được điều chỉnh thành ${adjustedSize.size} do ${changes.join(' và ')}`;
        } else if (hasDetailedMeasurements) {
            if (adjustedSize.size === baseSize.size) {
                const measurementNames = detailedMeasurements.map(m => {
                    const labels = {
                        'chest': 'vòng ngực',
                        'shoulder': 'vai', 
                        'waist': 'vòng eo',
                        'hip': 'vòng hông',
                        'sleeve': 'tay áo',
                        'thigh': 'đùi',
                        'inseam': 'dài quần'
                    };
                    return `${labels[m] || m} (${measurements[m]}cm)`;
                }).join(', ');
                explanation = `Size ${adjustedSize.size} dựa trên số đo ${measurementNames}`;
                
                // Thêm thông tin về height/weight nếu khác nhau
                const heightWeightSize = findRegularSize(sizeData.products[selectedProduct].sizeChart[gender], measurements.height, measurements.weight);
                if (heightWeightSize && heightWeightSize.size !== adjustedSize.size) {
                    explanation += `. Lưu ý: Theo chiều cao/cân nặng sẽ là size ${heightWeightSize.size}, nhưng số đo chi tiết phù hợp hơn với size ${adjustedSize.size}`;
                }
            } else {
                explanation += `được điều chỉnh thành ${adjustedSize.size} dựa trên số đo chi tiết`;
            }
        } else if (adjustedSize.size !== baseSize.size) {
            explanation += `được điều chỉnh thành ${adjustedSize.size}`;
        } else {
            explanation = `Size phù hợp với tùy chỉnh của bạn: ${adjustedSize.size}`;
        }

        document.getElementById('alternativeSizeExplanation').textContent = explanation;
    } else {
        alternativeResult.classList.add('hidden');
    }

    updateSizeChartHighlight();
}

function getAlternativeSizeExplanation(fitPreference, bellyType) {
    const fitText = {
        'loose': 'rộng hơn',
        'tight': 'ôm hơn',
        'regular': 'vừa vặn'
    }[fitPreference];

    const bellyText = {
        'flat': 'phẳng',
        'round': 'tròn',
        'normal': 'bình thường'
    }[bellyType];

    let explanation = 'Kích thước này được điều chỉnh dựa trên ';
    const adjustments = [];

    if (fitPreference !== 'regular') {
        adjustments.push(`yêu cầu mặc ${fitText}`);
    }
    if (bellyType !== 'normal') {
        adjustments.push(`dáng bụng ${bellyText}`);
    }

    return explanation + adjustments.join(' và ') + ' của bạn.';
}

function calculateAlternativeSize(baseSize, preferences) {
    if (!baseSize) return '';
    
    // Convert baseSize to number if it's a letter size
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const currentIndex = sizes.indexOf(baseSize);
    
    // Calculate adjustment based on preferences
    let sizeAdjustment = 0;
    if (preferences.fitPreference === 'loose') sizeAdjustment += 1;
    if (preferences.fitPreference === 'tight') sizeAdjustment -= 1;
    if (preferences.bellyType === 'round') sizeAdjustment += 1;
    if (preferences.bellyType === 'flat') sizeAdjustment -= 1;
    
    if (currentIndex !== -1) {
        // Handle letter sizes
        const newIndex = Math.max(0, Math.min(sizes.length - 1, currentIndex + sizeAdjustment));
        return sizes[newIndex];
    } else if (!isNaN(parseInt(baseSize))) {
        // Handle numeric sizes
        const numericSize = parseInt(baseSize);
        return Math.max(0, numericSize + sizeAdjustment).toString();
    }
    
    return ''; // Return empty if size cannot be calculated
}

function updateUI(productType) {
    const product = sizeData.products[productType];

    // Update product selection UI
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.product === productType);
    });

    // Update form
    document.getElementById('productType').value = productType;
    document.getElementById('selectedProductIcon').innerHTML = product.icon;
    document.getElementById('selectedProductName').textContent = product.name;
    
    // Show/hide elements
    document.querySelector('.selected-product').style.display = 'flex';
    document.getElementById('measurementForm').style.display = 'block';
    
    // Set default gender if none selected
    if (!document.querySelector('input[name="gender"]:checked')) {
        document.getElementById('male').checked = true;
    }
}

function displaySizeChart(productType) {
    const product = sizeData.products[productType];
    const gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';
    const sizes = product.sizeChart[gender];
    
    const measurementLabels = {
        'height': 'Chiều cao (cm)',
        'weight': 'Cân nặng (kg)',
        'chest': 'Vòng ngực (cm)',
        'waist': 'Vòng eo (cm)',
        'hip': 'Vòng hông (cm)',
        'shoulder': 'Vai (cm)',
        'length': 'Chiều dài (cm)',
        'sleeve': 'Tay áo (cm)',
        'thigh': 'Đùi (cm)',
        'inseam': 'Dài quần (cm)'
    };

    // Get all measurement types
    const measurements = new Set();
    sizes.forEach(size => {
        Object.keys(size.measurements).forEach(key => measurements.add(key));
    });

    // Create table header
    let tableHTML = '<tr><th>Size</th>';
    measurements.forEach(measurement => {
        tableHTML += `<th>${measurementLabels[measurement] || measurement}</th>`;
    });
    tableHTML += '</tr>';

    // Add data rows
    sizes.forEach(size => {
        tableHTML += `<tr data-size="${size.size}"><td>${size.size}</td>`;
        measurements.forEach(measurement => {
            tableHTML += `<td>${size.measurements[measurement] || '-'}</td>`;
        });
        tableHTML += '</tr>';
    });

    document.getElementById('sizeChartTable').innerHTML = tableHTML;
    updateSizeChartHighlight();
}

function createMeasurementInputs(product) {
    const mainContainer = document.getElementById('measurementInputs');
    const modalContainer = document.querySelector('.modal-content');
    mainContainer.innerHTML = '';
    
    // Định nghĩa labels cho các trường đo
    const measurementLabels = {
        'height': 'Chiều cao (cm)',
        'weight': 'Cân nặng (kg)',
        'chest': 'Vòng ngực (cm)',
        'waist': 'Vòng eo (cm)',
        'hip': 'Vòng hông (cm)',
        'shoulder': 'Vai (cm)',
        'length': 'Chiều dài (cm)',
        'sleeve': 'Tay áo (cm)',
        'thigh': 'Đùi (cm)',
        'inseam': 'Dài quần (cm)'
    };

    // Tạo các trường cơ bản (height và weight) trong form chính
    const basicMeasurements = ['height', 'weight'];
    basicMeasurements.forEach(measurement => {
        if (product.requiredMeasurements.includes(measurement)) {
            const div = document.createElement('div');
            div.className = 'measurement-input form-group required';
            
            const label = document.createElement('label');
            label.htmlFor = measurement;
            label.textContent = measurementLabels[measurement];
            
            const input = document.createElement('input');
            input.type = 'number';
            input.id = measurement;
            input.name = measurement;
            input.required = true;
            input.min = '0';
            input.step = '0.5';
            input.addEventListener('input', () => {
                updateSizeChartHighlight();
                handleInputChange();
            });
            
            div.appendChild(label);
            div.appendChild(input);
            mainContainer.appendChild(div);
        }
    });

    // Tìm div chứa các trường tùy chọn trong modal
    let optionalFieldsContainer = modalContainer.querySelector('.optional-measurements');
    if (!optionalFieldsContainer) {
        optionalFieldsContainer = document.createElement('div');
        optionalFieldsContainer.className = 'optional-measurements';
        // Chèn container trước nút Xác nhận
        const confirmButton = modalContainer.querySelector('button');
        modalContainer.insertBefore(optionalFieldsContainer, confirmButton);
    }
    optionalFieldsContainer.innerHTML = '<h4>Số đo chi tiết:</h4>';

    // Di chuyển các trường đo còn lại vào modal
    const otherMeasurements = product.requiredMeasurements
        .filter(m => !basicMeasurements.includes(m))
        .concat(product.optionalMeasurements || []);

    otherMeasurements.forEach(measurement => {
        const div = document.createElement('div');
        div.className = 'measurement-input form-group';
        if (product.requiredMeasurements.includes(measurement)) {
            div.classList.add('required');
        }
        
        const label = document.createElement('label');
        label.htmlFor = measurement;
        label.textContent = measurementLabels[measurement];
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = measurement;
        input.name = measurement;
        input.min = '0';
        input.step = '0.5';
        input.required = product.requiredMeasurements.includes(measurement);
        input.addEventListener('input', () => {
            updateSizeChartHighlight();
            handleInputChange();
        });
        
        div.appendChild(label);
        div.appendChild(input);
        optionalFieldsContainer.appendChild(div);
    });
}

function updateSizeDisplay(finalSize, baseSize, measurements) {
    const result = document.getElementById('result');
    const recommendedSize = document.getElementById('recommendedSize');
    const sizeDetails = document.getElementById('sizeDetails');
    const isNumericSize = selectedProduct === 'dress_pants';

    recommendedSize.textContent = finalSize.size;

    let details = `
        <p>Dựa trên thông số của bạn:</p>
        <p>- Chiều cao: ${measurements.height} cm</p>
        <p>- Cân nặng: ${measurements.weight} kg</p>`;

    if (isNumericSize && baseSize.measurements) {
        details += `
            <p>- Size phù hợp: Size ${baseSize.size}</p>
            <p>Chi tiết:</p>
            <p>- Vòng eo: ${baseSize.measurements.waist}cm</p>
            <p>- Vòng mông: ${baseSize.measurements.hip}cm</p>
            <p>- Vòng đùi: ${baseSize.measurements.thigh}cm</p>
            <p>- Chiều dài: ${baseSize.measurements.length}cm</p>
            <p>- Ống quần: ${baseSize.measurements.leg}cm</p>`;
    } else {
        details += `<p>- Size phù hợp: ${baseSize.size}</p>`;
    }

    if (customSettings.fitPreference !== 'regular' || customSettings.bellyType !== 'normal') {
        details += `<p>Với tùy chỉnh:</p>`;
        if (customSettings.fitPreference !== 'regular') {
            details += `<p>- Độ ôm: ${getPreferenceText(customSettings.fitPreference)}</p>`;
        }
        if (customSettings.bellyType !== 'normal') {
            details += `<p>- Dạng bụng: ${getBellyTypeText(customSettings.bellyType)}</p>`;
        }
        if (finalSize.size !== baseSize.size) {
            details += `<p>- Size được điều chỉnh: ${finalSize.size}</p>`;
        }
    }

    sizeDetails.innerHTML = details;
    showResult();
}

function updateSizeChartHighlight() {
    const productType = document.getElementById('productType').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    if (!productType || !gender) return;

    const product = sizeData.products[productType];
    const sizes = product.sizeChart[gender];
    
    const currentMeasurements = {};
    product.requiredMeasurements.forEach(measurement => {
        const input = document.getElementById(measurement);
        if (input?.value) {
            currentMeasurements[measurement] = parseFloat(input.value);
        }
    });

    document.querySelectorAll('.size-chart td').forEach(td => {
        td.classList.remove('highlight', 'suggested');
    });

    const matches = sizes.filter(size => {
        return product.requiredMeasurements.every(measurement => {
            if (size.measurements?.[measurement]) {
                const value = size.measurements[measurement];
                if (typeof value === 'string' && value.includes('-')) {
                    const [min, max] = value.split('-').map(Number);
                    return currentMeasurements[measurement] >= min && 
                           currentMeasurements[measurement] <= max;
                }
                return Math.abs(currentMeasurements[measurement] - value) <= 2;
            }
            if (size[measurement]) {
                return currentMeasurements[measurement] >= size[measurement].min && 
                       currentMeasurements[measurement] <= size[measurement].max;
            }
            return true;
        });
    });

    matches.forEach((size, index) => {
        const row = document.querySelector(`.size-chart tr[data-size="${size.size}"]`);
        if (row) {
            row.querySelectorAll('td').forEach(td => {
                td.classList.add(index === 0 ? 'suggested' : 'highlight');
            });
        }
    });

    if (matches.length > 0) {
        const bestMatch = matches[0];
        recommendedSize.textContent = bestMatch.size;
        result.classList.remove('hidden');
    }
}

function findBaseSize(productType, gender, height, weight, allMeasurements = {}) {
    const product = sizeData.products[productType];
    const sizes = product?.sizeChart?.[gender];
    if (!sizes) return null;

    if (productType === 'dress_pants') {
        return findPantsSize(sizes, weight);
    }

    // Kiểm tra xem có số đo chi tiết không (ngoài height và weight)
    const detailedMeasurements = Object.keys(allMeasurements).filter(key => 
        key !== 'height' && key !== 'weight' && allMeasurements[key]);
    
    console.log('Available detailed measurements:', detailedMeasurements);
    
    // Tìm size dựa trên height/weight trước
    const sizeByHeightWeight = findRegularSize(sizes, height, weight);
    console.log('Size by height/weight:', sizeByHeightWeight?.size);
    
    // Nếu có số đo chi tiết, tìm size dựa trên chúng
    let sizeByDetailedMeasurements = null;
    if (detailedMeasurements.length > 0) {
        sizeByDetailedMeasurements = findSizeByDetailedMeasurements(sizes, allMeasurements);
        console.log('Size by detailed measurements:', sizeByDetailedMeasurements?.size);
        
        // So sánh và quyết định
        if (sizeByDetailedMeasurements && sizeByHeightWeight) {
            if (sizeByDetailedMeasurements.size === sizeByHeightWeight.size) {
                console.log('✅ Both methods agree on size:', sizeByDetailedMeasurements.size);
                return sizeByDetailedMeasurements;
            } else {
                console.log('⚠️  Conflict detected!');
                console.log(`   Height/Weight suggests: ${sizeByHeightWeight.size}`);
                console.log(`   Detailed measurements suggest: ${sizeByDetailedMeasurements.size}`);
                
                // Ưu tiên detailed measurements nếu có nhiều measurement khớp
                const detailedMeasurementCount = detailedMeasurements.length;
                if (detailedMeasurementCount >= 2) {
                    console.log('🎯 Using detailed measurements (multiple measurements available)');
                    return sizeByDetailedMeasurements;
                } else {
                    console.log('⚖️  Using average between the two suggestions');
                    return findAverageSize(sizes, sizeByHeightWeight, sizeByDetailedMeasurements);
                }
            }
        } else if (sizeByDetailedMeasurements) {
            console.log('🎯 Using detailed measurements only');
            return sizeByDetailedMeasurements;
        }
    }
    
    // Fallback về height/weight
    console.log('📏 Using height/weight method');
    return sizeByHeightWeight;
}

function findPantsSize(sizes, weight) {
    // Ước tính vòng eo dựa trên cân nặng
    let estimatedWaist = weight * 0.8;
    let bestMatch = null;
    let minDiff = Number.MAX_VALUE;

    // Tìm size có vòng eo gần nhất
    for (const size of sizes) {
        const waist = size.measurements.waist;
        const sizeDiff = Math.abs(estimatedWaist - waist);
        if (sizeDiff < minDiff) {
            minDiff = sizeDiff;
            bestMatch = size;
        }
    }
    
    // Đảm bảo luôn trả về ít nhất 1 size
    if (!bestMatch && sizes.length > 0) {
        bestMatch = sizes[Math.floor(sizes.length / 2)]; // Chọn size ở giữa
    }
    
    return bestMatch;
}

function findRegularSize(sizes, height, weight) {
    // Tìm size khớp chính xác trước
    for (const size of sizes) {
        if (height >= size.height?.min && 
            height <= size.height?.max && 
            weight >= size.weight?.min && 
            weight <= size.weight?.max) {
            return size;
        }
    }
    
    // Nếu không tìm thấy size khớp chính xác, tìm size gần nhất
    let bestMatch = null;
    let minDistance = Number.MAX_VALUE;
    
    for (const size of sizes) {
        // Tính khoảng cách từ số đo của người dùng đến khoảng của size
        let heightDistance = 0;
        let weightDistance = 0;
        
        // Khoảng cách chiều cao
        if (height < size.height?.min) {
            heightDistance = size.height.min - height;
        } else if (height > size.height?.max) {
            heightDistance = height - size.height.max;
        }
        
        // Khoảng cách cân nặng
        if (weight < size.weight?.min) {
            weightDistance = size.weight.min - weight;
        } else if (weight > size.weight?.max) {
            weightDistance = weight - size.weight.max;
        }
        
        // Tổng khoảng cách (có trọng số)
        const totalDistance = heightDistance * 0.5 + weightDistance * 0.5;
        
        if (totalDistance < minDistance) {
            minDistance = totalDistance;
            bestMatch = size;
        }
    }
    
    return bestMatch;
}

function adjustSize(baseSize, preferences, productType) {
    if (!baseSize) return null;
    
    // Nếu là quần thì không điều chỉnh (vì dùng số, không phải chữ)
    if (productType === 'dress_pants') return baseSize;
    
    // Kiểm tra xem có thay đổi về độ ôm hoặc dáng bụng không
    const hasFitPreferenceChange = preferences.fitPreference !== 'regular';
    const hasBellyTypeChange = preferences.bellyType !== 'normal';
    
    // Nếu không có thay đổi gì về độ ôm/dáng bụng, trả về size gốc
    if (!hasFitPreferenceChange && !hasBellyTypeChange) {
        console.log('No fit/belly adjustments needed, returning base size:', baseSize.size);
        return baseSize;
    }

    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL', '5XL'];
    let currentIndex = sizeOrder.indexOf(baseSize.size);
    
    if (currentIndex === -1) {
        console.warn('Size not found in order:', baseSize.size);
        return baseSize; // Nếu không tìm thấy size trong danh sách
    }

    let adjustment = 0;
    
    // Điều chỉnh theo độ ôm
    if (preferences.fitPreference === 'loose') {
        adjustment += 1; // Rộng +1 size
    } else if (preferences.fitPreference === 'tight') {
        adjustment -= 1; // Sát -1 size
    }

    // Điều chỉnh theo dáng bụng
    if (preferences.bellyType === 'round') {
        adjustment += 1; // Bụng tròn +1 size
    } else if (preferences.bellyType === 'flat') {
        adjustment -= 1; // Bụng phẳng -1 size
    }

    // Áp dụng điều chỉnh
    const newIndex = Math.max(0, Math.min(currentIndex + adjustment, sizeOrder.length - 1));
    
    console.log(`Size adjustment: ${baseSize.size} -> ${sizeOrder[newIndex]} (adjustment: ${adjustment})`);

    // Trả về size mới với các thuộc tính của baseSize
    return {
        ...baseSize,
        size: sizeOrder[newIndex]
    };
}

// Tìm size dựa trên số đo chi tiết (chest, shoulder, waist, hip, etc.)
function findSizeByDetailedMeasurements(sizes, measurements) {
    let bestMatch = null;
    let bestScore = -1;
    let detailedAnalysis = {};
    
    console.log('Finding size by detailed measurements:', measurements);
    
    for (const size of sizes) {
        let score = 0;
        let matchCount = 0;
        let sizeAnalysis = {
            size: size.size,
            matches: [],
            conflicts: [],
            totalScore: 0
        };
        
        // Kiểm tra từng số đo chi tiết
        Object.keys(measurements).forEach(measurement => {
            if (measurement === 'height' || measurement === 'weight') return; // Bỏ qua height/weight
            
            const userValue = measurements[measurement];
            const sizeValue = size.measurements?.[measurement];
            
            if (sizeValue && userValue && !isNaN(userValue)) {
                if (typeof sizeValue === 'string' && sizeValue.includes('-')) {
                    // Trường hợp có range như "88-92"
                    const [min, max] = sizeValue.split('-').map(Number);
                    if (userValue >= min && userValue <= max) {
                        score += 3; // Điểm cao cho khớp chính xác
                        matchCount++;
                        sizeAnalysis.matches.push({
                            measurement,
                            userValue,
                            range: `${min}-${max}`,
                            status: 'perfect_match',
                            points: 3
                        });
                        console.log(`${measurement}: ${userValue} fits perfectly in range ${min}-${max} for size ${size.size} (+3 points)`);
                    } else {
                        // Tính điểm dựa trên khoảng cách gần nhất đến range
                        const distance = Math.min(Math.abs(userValue - min), Math.abs(userValue - max));
                        if (distance <= 5) { // Cho phép sai lệch 5cm
                            const points = Math.max(0, 2 - distance / 2.5);
                            score += points;
                            matchCount++;
                            sizeAnalysis.matches.push({
                                measurement,
                                userValue,
                                range: `${min}-${max}`,
                                status: 'close_match',
                                distance,
                                points: parseFloat(points.toFixed(1))
                            });
                            console.log(`${measurement}: ${userValue} is ${distance}cm from range ${min}-${max} for size ${size.size} (+${points.toFixed(1)} points)`);
                        } else {
                            // Quá xa, nhưng vẫn ghi nhận để phân tích
                            sizeAnalysis.conflicts.push({
                                measurement,
                                userValue,
                                range: `${min}-${max}`,
                                status: 'too_far',
                                distance,
                                points: 0
                            });
                            console.log(`${measurement}: ${userValue} is too far (${distance}cm) from range ${min}-${max} for size ${size.size} (0 points)`);
                        }
                    }
                } else if (typeof sizeValue === 'number') {
                    // Trường hợp giá trị cố định
                    const distance = Math.abs(userValue - sizeValue);
                    if (distance <= 5) {
                        const points = Math.max(0, 3 - distance / 2);
                        score += points;
                        matchCount++;
                        sizeAnalysis.matches.push({
                            measurement,
                            userValue,
                            expectedValue: sizeValue,
                            status: distance === 0 ? 'perfect_match' : 'close_match',
                            distance,
                            points: parseFloat(points.toFixed(1))
                        });
                        console.log(`${measurement}: ${userValue} vs ${sizeValue} for size ${size.size}, distance: ${distance} (+${points.toFixed(1)} points)`);
                    } else {
                        sizeAnalysis.conflicts.push({
                            measurement,
                            userValue,
                            expectedValue: sizeValue,
                            status: 'too_far',
                            distance,
                            points: 0
                        });
                        console.log(`${measurement}: ${userValue} vs ${sizeValue} for size ${size.size}, too far: ${distance}cm (0 points)`);
                    }
                }
            }
        });
        
        // Tính điểm trung bình và bonus cho nhiều measurement khớp
        const avgScore = matchCount > 0 ? score / matchCount : 0;
        const finalScore = avgScore * (1 + matchCount * 0.1); // Bonus cho nhiều measurement
        
        sizeAnalysis.totalScore = finalScore;
        detailedAnalysis[size.size] = sizeAnalysis;
        
        console.log(`Size ${size.size}: avgScore=${avgScore.toFixed(2)}, matchCount=${matchCount}, finalScore=${finalScore.toFixed(2)}`);
        
        if (finalScore > bestScore) {
            bestScore = finalScore;
            bestMatch = size;
        }
    }
    
    // Log detailed analysis
    console.log('=== DETAILED SIZE ANALYSIS ===');
    Object.values(detailedAnalysis).forEach(analysis => {
        console.log(`\nSize ${analysis.size}:`);
        console.log(`  Matches: ${analysis.matches.length}`);
        analysis.matches.forEach(match => {
            console.log(`    ✓ ${match.measurement}: ${match.userValue} ${match.range ? `in ${match.range}` : `vs ${match.expectedValue}`} (${match.points} pts)`);
        });
        console.log(`  Conflicts: ${analysis.conflicts.length}`);
        analysis.conflicts.forEach(conflict => {
            console.log(`    ✗ ${conflict.measurement}: ${conflict.userValue} ${conflict.range ? `vs ${conflict.range}` : `vs ${conflict.expectedValue}`} (${conflict.distance}cm off)`);
        });
        console.log(`  Total Score: ${analysis.totalScore.toFixed(2)}`);
    });
    console.log('===============================');
    
    console.log(`Best match: Size ${bestMatch?.size} with score ${bestScore.toFixed(2)}`);
    
    // Chỉ trả về kết quả nếu có điểm số đủ tốt (ít nhất 1 measurement khớp)
    return bestScore > 0.8 ? bestMatch : null;
}

// Tìm size trung bình khi có xung đột giữa height/weight và detailed measurements
function findAverageSize(sizes, sizeByHeightWeight, sizeByDetailedMeasurements) {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL', '5XL'];
    
    const index1 = sizeOrder.indexOf(sizeByHeightWeight.size);
    const index2 = sizeOrder.indexOf(sizeByDetailedMeasurements.size);
    
    if (index1 === -1 || index2 === -1) {
        // Nếu không tìm thấy size trong danh sách, ưu tiên detailed measurements
        console.log('Cannot find size in order, using detailed measurements');
        return sizeByDetailedMeasurements;
    }
    
    // Tính trung bình (làm tròn về size gần nhất)
    const averageIndex = Math.round((index1 + index2) / 2);
    const averageSize = sizeOrder[averageIndex];
    
    // Tìm size object tương ứng
    const averageSizeObj = sizes.find(size => size.size === averageSize);
    
    console.log(`Average size: ${sizeByHeightWeight.size} + ${sizeByDetailedMeasurements.size} = ${averageSize}`);
    
    return averageSizeObj || sizeByDetailedMeasurements;
}

// Validation and Measurement Collection
function validateMeasurements(measurements) {
    const { height, weight } = measurements;
    
    // Kiểm tra height (cho phép khoảng rộng hơn)
    if (isNaN(height) || height < 120 || height > 220) {
        console.warn('Height out of range:', height);
        return false;
    }
    
    // Kiểm tra weight (cho phép khoảng rộng hơn)
    if (isNaN(weight) || weight < 20 || weight > 200) {
        console.warn('Weight out of range:', weight);
        return false;
    }
    
    return true;
}

function collectMeasurements(requiredMeasurements) {
    const measurements = {};
    requiredMeasurements.forEach(measurement => {
        const input = document.getElementById(measurement);
        if (input?.value) {
            measurements[measurement] = parseFloat(input.value);
        }
    });
    return measurements;
}

function calculateDifferences(sizes, measurements) {
    return sizes.map(size => {
        let totalDiff = 0;
        let measurementCount = 0;

        Object.keys(measurements).forEach(measurement => {
            if (size.measurements[measurement]) {
                const diff = Math.abs(size.measurements[measurement] - measurements[measurement]);
                totalDiff += diff;
                measurementCount++;
            }
        });

        return {
            size: size.size,
            avgDiff: measurementCount > 0 ? totalDiff / measurementCount : Infinity
        };
    }).sort((a, b) => a.avgDiff - b.avgDiff);
}

function highlightSizes(differences) {
    if (differences.length === 0) return;

    const bestMatch = differences[0];
    const bestMatchRow = document.querySelector(`#sizeChartTable tr[data-size="${bestMatch.size}"]`);
    if (bestMatchRow) {
        bestMatchRow.classList.add('best-match');
    }

    const threshold = bestMatch.avgDiff * 1.1;
    differences.slice(1).forEach(diff => {
        if (diff.avgDiff <= threshold) {
            const row = document.querySelector(`#sizeChartTable tr[data-size="${diff.size}"]`);
            if (row) {
                row.classList.add('possible-match');
            }
        }
    });
}

function clearHighlights() {
    document.querySelectorAll('#sizeChartTable tr').forEach(row => {
        row.classList.remove('best-match', 'possible-match');
    });
}

function showResult() {
    document.getElementById('result').classList.remove('hidden');
}

function hideResult() {
    document.getElementById('result').classList.add('hidden');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize product grid
    Object.entries(sizeData.products).forEach(([key, product]) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.product = key;
        card.innerHTML = `
            <div class="product-icon">${product.icon}</div>
            <h3>${product.name}</h3>
        `;
        card.addEventListener('click', () => handleProductSelection(key));
        productGrid.appendChild(card);
    });    // Event listeners
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (selectedProduct) {
                displaySizeChart(selectedProduct);
                updateSizeChartHighlight();
                handleInputChange();
            }
        });
    });

    // Xử lý sự kiện cho modal tùy chỉnh
    document.getElementById('customizeBtn').addEventListener('click', () => {
        document.getElementById('customizeModal').classList.remove('hidden');
    });

    document.getElementById('closeCustomize').addEventListener('click', handleCustomizeClose);
    
    // Event listeners cho các controls tùy chỉnh
    document.getElementById('fitPreference').addEventListener('change', () => {
        console.log('Fit preference changed to:', document.getElementById('fitPreference').value);
        customSettings.fitPreference = document.getElementById('fitPreference').value;
    });

    document.getElementById('bellyType').addEventListener('change', () => {
        console.log('Belly type changed to:', document.getElementById('bellyType').value);
        customSettings.bellyType = document.getElementById('bellyType').value;
    });
});

// Xử lý đóng modal tùy chỉnh và cập nhật kết quả
function handleCustomizeClose() {
    const newFitPreference = document.getElementById('fitPreference').value;
    const newBellyType = document.getElementById('bellyType').value;
    
    // Kiểm tra xem có sự thay đổi so với mặc định không
    const hasChanges = (newFitPreference !== 'regular' || newBellyType !== 'normal');
    
    // Cập nhật các tùy chọn
    customSettings.fitPreference = newFitPreference;
    customSettings.bellyType = newBellyType;
    customSettings.modified = hasChanges;
    
    console.log('Customize settings updated:', customSettings);
    
    // Ẩn modal
    document.getElementById('customizeModal').classList.add('hidden');
    
    // Kích hoạt lại việc tính toán size để cập nhật kết quả
    if (selectedProduct) {
        handleInputChange();
    }
}

// Hàm thu thập các số đo hiện tại
function collectCurrentMeasurements() {
    const measurements = {};
    const product = sizeData.products[selectedProduct];
    
    if (!product) return null;

    // Thu thập các số đo bắt buộc
    let isValid = true;
    product.requiredMeasurements.forEach(measurement => {
        const input = document.getElementById(measurement);
        if (input && input.value) {
            measurements[measurement] = parseFloat(input.value);
        } else {
            isValid = false;
        }
    });

    // Thu thập các số đo tùy chọn nếu có
    if (product.optionalMeasurements) {
        product.optionalMeasurements.forEach(measurement => {
            const input = document.getElementById(measurement);
            if (input && input.value) {
                measurements[measurement] = parseFloat(input.value);
            }
        });
    }

    return isValid ? measurements : null;
}
