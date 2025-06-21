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
    const baseSize = findBaseSize(selectedProduct, gender, height, weight);
    
    if (!baseSize) return;

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
    
    // Chỉ hiển thị kết quả thay thế khi đã có tùy chỉnh
    if (customSettings.modified) {
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
        }

        if (changes.length > 0) {
            explanation += `được điều chỉnh thành ${adjustedSize.size} do ${changes.join(' và ')}`;
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
    // Nếu là quần thì trả về size gốc
    if (productType === 'dress_pants') return baseSize;
    
    // Nếu không có tùy chỉnh đặc biệt hoặc tất cả đều ở mức bình thường
    if (!preferences) return baseSize;

    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL', '5XL'];
    let currentIndex = sizeOrder.indexOf(baseSize.size);
    
    if (currentIndex === -1) return baseSize; // Nếu không tìm thấy size trong danh sách

    // Điều chỉnh theo độ ôm
    if (preferences.fitPreference === 'loose') {
        currentIndex += 1; // Rộng +1 size
    } else if (preferences.fitPreference === 'tight') {
        currentIndex -= 1; // Sát -1 size
    }
    // Vừa (regular) giữ nguyên

    // Điều chỉnh theo dáng bụng
    if (preferences.bellyType === 'round') {
        currentIndex += 1; // Bụng tròn +1 size
    }
    // Bụng phẳng hoặc bình thường giữ nguyên

    // Đảm bảo index không vượt quá giới hạn của mảng
    currentIndex = Math.max(0, Math.min(currentIndex, sizeOrder.length - 1));

    // Trả về size mới với các thuộc tính của baseSize
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

    // Xử lý sự kiện cho modal tùy chỉnh
    document.getElementById('customizeBtn').addEventListener('click', () => {
        document.getElementById('customizeModal').classList.remove('hidden');
    });

    document.getElementById('closeCustomize').addEventListener('click', handleCustomizeClose);
    
    // Event listeners cho các controls tùy chỉnh
    document.getElementById('fitPreference').addEventListener('change', () => {
        customSettings.fitPreference = document.getElementById('fitPreference').value;
    });

    document.getElementById('bellyType').addEventListener('change', () => {
        customSettings.bellyType = document.getElementById('bellyType').value;
    });
});

// Xử lý đóng modal tùy chỉnh và cập nhật kết quả
function handleCustomizeClose() {
    const newFitPreference = document.getElementById('fitPreference').value;
    const newBellyType = document.getElementById('bellyType').value;
    
    // Kiểm tra xem có sự thay đổi so với mặc định không
    customSettings.modified = (newFitPreference !== 'regular' || newBellyType !== 'normal');
    
    // Cập nhật các tùy chọn
    customSettings.fitPreference = newFitPreference;
    customSettings.bellyType = newBellyType;
    
    // Ẩn modal
    customizeModal.classList.add('hidden');
    
    // Kích hoạt lại việc tính toán size để cập nhật kết quả
    handleInputChange();
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
