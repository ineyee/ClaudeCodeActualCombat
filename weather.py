# /// script
# dependencies = ["mcp[cli]", "httpx"]
# ///
"""
Weather MCP Server
==================
基于 open-meteo.com 免费天气 API 的 MCP（Model Context Protocol）服务器。
无需 API Key，支持全球任意经纬度的实时天气查询。

依赖安装：
    pip install mcp httpx

启动方式（stdio 模式，供 Claude Desktop / Claude Code 调用）：
    python weather.py

在 Claude Desktop 的 claude_desktop_config.json 中注册：
    {
      "mcpServers": {
        "weather": {
          "command": "python",
          "args": ["/path/to/weather.py"]
        }
      }
    }
"""

import httpx
from mcp.server.fastmcp import FastMCP

# ── 初始化 MCP Server，名称会显示在客户端工具列表里 ──────────────────────────
mcp = FastMCP("weather")

# open-meteo API 基础地址（免费、无需鉴权）
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

# WMO 天气代码 → 中文描述映射表
# 完整规范见 https://open-meteo.com/en/docs#weathervariables
WMO_CODE_MAP = {
    0:  "晴天",
    1:  "基本晴朗",
    2:  "局部多云",
    3:  "阴天",
    45: "雾",
    48: "冻雾",
    51: "小毛毛雨",
    53: "中毛毛雨",
    55: "大毛毛雨",
    61: "小雨",
    63: "中雨",
    65: "大雨",
    71: "小雪",
    73: "中雪",
    75: "大雪",
    77: "冰粒",
    80: "小阵雨",
    81: "中阵雨",
    82: "强阵雨",
    85: "小阵雪",
    86: "大阵雪",
    95: "雷暴",
    96: "雷暴伴小冰雹",
    99: "雷暴伴大冰雹",
}


def _wmo_to_desc(code: int) -> str:
    """将 WMO 天气代码转换为可读描述，未知代码返回原始数字。"""
    return WMO_CODE_MAP.get(code, f"未知天气（代码 {code}）")


# ── Tool 1：按经纬度查询当前天气 ─────────────────────────────────────────────
@mcp.tool()
def get_current_weather(latitude: float, longitude: float, timezone: str = "auto") -> str:
    """
    查询指定经纬度的当前天气。

    参数：
        latitude  - 纬度，范围 -90 ~ 90（正数为北纬）
        longitude - 经度，范围 -180 ~ 180（正数为东经）
        timezone  - 时区字符串，默认 "auto" 自动推断；
                    也可手动指定，如 "Asia/Shanghai"、"America/New_York"

    返回：
        格式化的天气文本，包含温度、风速、风向、天气状况、白天/夜晚。
    """
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current_weather": "true",
        "timezone": timezone,
    }

    # 发起 HTTP GET 请求，超时 10 秒
    response = httpx.get(OPEN_METEO_URL, params=params, timeout=10)
    response.raise_for_status()  # 非 2xx 状态码时抛出异常

    data = response.json()
    cw = data["current_weather"]  # current_weather 字段

    # 解析各字段
    temp        = cw["temperature"]       # 气温（°C）
    windspeed   = cw["windspeed"]         # 风速（km/h）
    winddeg     = cw["winddirection"]     # 风向（度，0=北，90=东）
    weathercode = cw["weathercode"]       # WMO 天气代码
    is_day      = cw["is_day"]            # 1=白天，0=夜晚
    obs_time    = cw["time"]              # 观测时间（ISO 8601）
    tz          = data["timezone"]        # 实际使用的时区

    day_night = "白天" if is_day else "夜晚"
    weather_desc = _wmo_to_desc(weathercode)

    return (
        f"📍 坐标：{data['latitude']}°N, {data['longitude']}°E\n"
        f"🕐 观测时间：{obs_time}（{tz}）\n"
        f"🌡  气温：{temp}°C\n"
        f"💨 风速：{windspeed} km/h，风向：{winddeg}°\n"
        f"🌤  天气：{weather_desc}\n"
        f"☀️  昼夜：{day_night}"
    )


# ── Tool 2：查询未来 N 天的每日最高/最低气温 ─────────────────────────────────
@mcp.tool()
def get_daily_forecast(latitude: float, longitude: float, days: int = 3, timezone: str = "auto") -> str:
    """
    查询指定经纬度未来若干天的每日天气预报。

    参数：
        latitude  - 纬度
        longitude - 经度
        days      - 预报天数，1 ~ 7，默认 3
        timezone  - 时区，默认 "auto"

    返回：
        每天的日期、最高/最低气温、天气状况的格式化文本。
    """
    # 限制 days 在合法范围内，避免无效请求
    days = max(1, min(days, 7))

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_max,temperature_2m_min,weathercode",
        "forecast_days": days,
        "timezone": timezone,
    }

    response = httpx.get(OPEN_METEO_URL, params=params, timeout=10)
    response.raise_for_status()

    data  = response.json()
    daily = data["daily"]  # daily 字段，包含各数组

    dates    = daily["time"]                  # 日期列表
    temp_max = daily["temperature_2m_max"]    # 每日最高气温
    temp_min = daily["temperature_2m_min"]    # 每日最低气温
    codes    = daily["weathercode"]           # 每日天气代码

    lines = [f"📅 未来 {days} 天天气预报（{data['timezone']}）\n"]
    for date, tmax, tmin, code in zip(dates, temp_max, temp_min, codes):
        desc = _wmo_to_desc(code)
        lines.append(f"  {date}  {tmin}°C ~ {tmax}°C  {desc}")

    return "\n".join(lines)


# ── 入口：以 stdio 模式运行（MCP 标准传输层）────────────────────────────────
if __name__ == "__main__":
    # transport="stdio" 表示通过标准输入/输出与 MCP 客户端通信
    # 这是 Claude Desktop 和 Claude Code 默认使用的传输方式
    mcp.run(transport="stdio")
