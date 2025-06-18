import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Route API để gọi dịch vụ AI gợi ý kích cỡ

export async function POST(req: Request) {
  try {
    const {
      product,
      height,
      heightUnit,
      weight,
      weightUnit,
      bellyShape,
      preference,
    } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    // Ghi log ra để kiểm tra có API key không
    console.log('OPENAI_API_KEY:', apiKey?.slice(0, 10) + '...');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Thiếu khóa API OpenAI' },
        { status: 500 }
      );
    }

    // Tạo prompt
    const prompt = `Bạn là chuyên gia thời trang. Dựa vào bảng kích thước chuẩn của sản phẩm ${product}, với chiều cao ${height}${heightUnit} và cân nặng ${weight}${weightUnit}, hình dáng bụng "${bellyShape}" và độ ôm mong muốn (${preference}/7), hãy đề xuất 2 size phù hợp kèm tỉ lệ phần trăm (ví dụ "S: 78%, M: 22%"), kèm giải thích chi tiết lý do lựa chọn.`;

    // Gọi OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const result = await response.json();

    // Ghi log chi tiết phản hồi từ API
    console.log('OpenAI response status:', response.status);
    console.log('OpenAI response body:', result);

    if (!response.ok) {
      let msg: string;

      if (response.status === 429) {
        msg =
          result.error?.message ||
          'Bạn đã vượt quá hạn mức API OpenAI, vui lòng kiểm tra gói sử dụng.';
      } else {
        msg = result.error?.message || 'Lỗi từ OpenAI API';
      }

      return NextResponse.json({ error: msg }, { status: response.status });
    }

    const content = result.choices?.[0]?.message?.content || '';

    return NextResponse.json({ result: content });
  } catch (err) {
    console.error('Lỗi hệ thống:', err);
    return NextResponse.json({ error: 'Lỗi API nội bộ' }, { status: 500 });
  }
}

