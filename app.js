document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sizeForm');
    const result = document.getElementById('result');
    const recommendedSize = document.getElementById('recommendedSize');
    const sizeDetails = document.getElementById('sizeDetails');
    const customizeBtn = document.getElementById('customizeBtn');
    const customizeModal = document.getElementById('customizeModal');
    const closeCustomizeBtn = document.getElementById('closeCustomize');

    // Tùy chỉnh mặc định
    let customSettings = {
        fitPreference: 'regular',
        bellyType: 'normal'
    };

    // Xử lý modal tùy chỉnh
    customizeBtn.addEventListener('click', function() {
        customizeModal.classList.remove('hidden');
    });

    closeCustomizeBtn.addEventListener('click', function() {
        customizeModal.classList.add('hidden');
        // Cập nhật tùy chỉnh
        customSettings.fitPreference = document.getElementById('fitPreference').value;
        customSettings.bellyType = document.getElementById('bellyType').value;
    });

    // Click bên ngoài modal để đóng
    customizeModal.addEventListener('click', function(e) {
        if (e.target === customizeModal) {
            customizeModal.classList.add('hidden');
        }
    });

    form.addEventListener('submit', handleSubmit);

    function findBaseSize(productType, gender, height, weight) {
        const sizesForProduct = sizeData[gender][productType];
        if (!sizesForProduct) return null;

        // Tìm size cơ bản dựa trên chiều cao và cân nặng
        for (const size of sizesForProduct) {
            if (height >= size.height.min && 
                height <= size.height.max && 
                weight >= size.weight.min && 
                weight <= size.weight.max) {
                return size;
            }
        }
        return null;
    }

    function adjustSize(baseSize, preferences) {
        if (!baseSize) return null;

        // Nếu không có tùy chỉnh hoặc tùy chỉnh ở mức mặc định, trả về size cơ bản
        if (!preferences || 
            (preferences.fitPreference === 'regular' && preferences.bellyType === 'normal')) {
            return baseSize;
        }

        // Mảng các size theo thứ tự
        const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL', '5XL'];
        let currentIndex = sizeOrder.indexOf(baseSize.size);
        
        // Điều chỉnh theo tùy chọn của khách hàng
        if (preferences.fitPreference === 'loose') currentIndex += 1;     // Thoải mái +1
        if (preferences.fitPreference === 'tight') currentIndex -= 1;     // Ôm sát -1
        if (preferences.bellyType === 'round') currentIndex += 1;        // Bụng to +1

        // Đảm bảo index không vượt quá giới hạn
        currentIndex = Math.max(0, Math.min(currentIndex, sizeOrder.length - 1));

        return {
            ...baseSize,
            size: sizeOrder[currentIndex]
        };
    }

    function handleSubmit(e) {
        e.preventDefault();

        const productType = document.getElementById('productType').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);

        // Kiểm tra dữ liệu đầu vào
        if (!productType) {
            alert('Vui lòng chọn loại sản phẩm');
            return;
        }
        if (!gender) {
            alert('Vui lòng chọn giới tính');
            return;
        }
        if (isNaN(height) || height < 140 || height > 200) {
            alert('Vui lòng nhập chiều cao hợp lệ (140-200 cm)');
            return;
        }
        if (isNaN(weight) || weight < 30 || weight > 150) {
            alert('Vui lòng nhập cân nặng hợp lệ (30-150 kg)');
            return;
        }

        // Tìm size cơ bản trước
        const baseSize = findBaseSize(productType, gender, height, weight);
        
        if (!baseSize) {
            alert('Không tìm thấy size phù hợp với thông số của bạn.\nVui lòng thử lại với các thông số khác hoặc liên hệ với chúng tôi để được tư vấn thêm.');
            result.classList.add('hidden');
            return;
        }

        // Điều chỉnh size nếu có tùy chỉnh
        const finalSize = adjustSize(baseSize, customSettings);

        // Hiển thị kết quả
        recommendedSize.textContent = finalSize.size;
        
        let details = `
            <p>Dựa trên thông số của bạn:</p>
            <p>- Chiều cao: ${height} cm</p>
            <p>- Cân nặng: ${weight} kg</p>
            <p>- Size cơ bản phù hợp: ${baseSize.size}</p>
        `;

        // Thêm thông tin về tùy chỉnh nếu có
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
        result.classList.remove('hidden');
    }

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
});
