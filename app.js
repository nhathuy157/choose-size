// State management
let selectedProduct = null;
const customSettings = {
    highlightBestMatch: true,
    showAllSizes: true,
    fitPreference: 'regular',
    bellyType: 'normal'
};

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
    
    // Hiển thị form nhập liệu và đảm bảo nó không bị ẩn
    const measurementForm = document.getElementById('measurementForm');
    measurementForm.classList.remove('hidden');
    measurementForm.style.display = 'block';
    
    // Cập nhật thông tin sản phẩm đã chọn
    document.querySelector('.selected-product').style.display = 'flex';
    document.getElementById('selectedProductIcon').innerHTML = product.icon;
    document.getElementById('selectedProductName').textContent = product.name;
    document.getElementById('productType').value = productType;

    // Tạo các trường nhập liệu
    createMeasurementInputs(product);
    
    // Hiển thị bảng size
    displaySizeChart(productType);
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

    // Kiểm tra các trường bắt buộc: chiều cao, cân nặng và giới tính
    product.requiredMeasurements.forEach(measurement => {
        const input = document.getElementById(measurement);
        if (!input?.value) {
            isValid = false;
            return;
        }
        measurements[measurement] = parseFloat(input.value);
    });

    // Thu thập thêm các trường tùy chọn nếu có
    if (product.optionalMeasurements) {
        product.optionalMeasurements.forEach(measurement => {
            const input = document.getElementById(measurement);
            if (input?.value) {
                measurements[measurement] = parseFloat(input.value);
            }
        });
    }

    if (!isValid || !validateMeasurements(measurements)) {
        hideResult();
        return;
    }

    updateSize(measurements, gender);
}

function updateSize(measurements, gender) {
    const height = measurements.height;
    const weight = measurements.weight;
    const baseSize = findBaseSize(selectedProduct, gender, height, weight);
    
    if (!baseSize) {
        hideResult();
        return;
    }

    const finalSize = adjustSize(baseSize, customSettings, selectedProduct);
    updateSizeDisplay(finalSize, baseSize, measurements);
    updateSizeChartHighlight();
}

// UI update functions
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
    const container = document.getElementById('measurementInputs');
    container.innerHTML = '';

    // Thêm các trường đo lường bắt buộc
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

    // Thêm các trường đo bắt buộc
    if (product.requiredMeasurements) {
        product.requiredMeasurements.forEach(measurement => {
            const div = document.createElement('div');
            div.className = 'measurement-input form-group required';
            
            const label = document.createElement('label');
            label.htmlFor = measurement;
            label.textContent = measurementLabels[measurement] || measurement;
            
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
            container.appendChild(div);
        });
    }

    // Thêm các trường đo tùy chọn
    if (product.optionalMeasurements) {
        product.optionalMeasurements.forEach(measurement => {
            const div = document.createElement('div');
            div.className = 'measurement-input form-group';
            
            const label = document.createElement('label');
            label.htmlFor = measurement;
            label.textContent = measurementLabels[measurement] || measurement;
            
            const input = document.createElement('input');
            input.type = 'number';
            input.id = measurement;
            input.name = measurement;
            input.required = false;
            input.min = '0';
            input.step = '0.5';
            input.addEventListener('input', () => {
                updateSizeChartHighlight();
                handleInputChange();
            });
            
            div.appendChild(label);
            div.appendChild(input);
            container.appendChild(div);
        });
    }
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

function findBaseSize(productType, gender, height, weight) {
    const product = sizeData.products[productType];
    const sizes = product?.sizeChart?.[gender];
    if (!sizes) return null;

    if (productType === 'dress_pants') {
        return findPantsSize(sizes, weight);
    }

    return findRegularSize(sizes, height, weight);
}

function findPantsSize(sizes, weight) {
    let estimatedWaist = weight * 0.8;
    let bestMatch = null;
    let minDiff = Number.MAX_VALUE;

    for (const size of sizes) {
        const waist = size.measurements.waist;
        const sizeDiff = Math.abs(estimatedWaist - waist);
        if (sizeDiff < minDiff) {
            minDiff = sizeDiff;
            bestMatch = size;
        }
    }
    return bestMatch;
}

function findRegularSize(sizes, height, weight) {
    for (const size of sizes) {
        if (height >= size.height?.min && 
            height <= size.height?.max && 
            weight >= size.weight?.min && 
            weight <= size.weight?.max) {
            return size;
        }
    }
    return null;
}

function adjustSize(baseSize, preferences, productType) {
    if (!baseSize) return null;
    if (productType === 'dress_pants') return baseSize;
    if (!preferences || 
        (preferences.fitPreference === 'regular' && preferences.bellyType === 'normal')) {
        return baseSize;
    }

    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL', '5XL'];
    let currentIndex = sizeOrder.indexOf(baseSize.size);
    
    if (preferences.fitPreference === 'loose') currentIndex += 1;
    if (preferences.fitPreference === 'tight') currentIndex -= 1;
    if (preferences.bellyType === 'round') currentIndex += 1;

    currentIndex = Math.max(0, Math.min(currentIndex, sizeOrder.length - 1));

    return {
        ...baseSize,
        size: sizeOrder[currentIndex]
    };
}

// Validation and Measurement Collection
function validateMeasurements(measurements) {
    const { height, weight } = measurements;
    return !(isNaN(height) || height < 140 || height > 200 || 
            isNaN(weight) || weight < 30 || weight > 150);
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

    customizeBtn.addEventListener('click', () => {
        customizeModal.classList.remove('hidden');
    });

    closeCustomizeBtn.addEventListener('click', handleCustomizeClose);

    customizeModal.addEventListener('click', (e) => {
        if (e.target === customizeModal) {
            handleCustomizeClose();
        }
    });
});

function handleCustomizeClose() {
    customizeModal.classList.add('hidden');
    customSettings.fitPreference = document.getElementById('fitPreference').value;
    customSettings.bellyType = document.getElementById('bellyType').value;
    handleInputChange();
}
