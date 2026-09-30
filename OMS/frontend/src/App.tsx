import { ConfigProvider, Result } from 'antd';
import koKR from 'antd/locale/ko_KR';

// 빈 앱 셸 - TopBar / LeftMenuBar / FlexLayout / StatusBar 구성으로 교체할 자리
export default function App() {
  return (
    <ConfigProvider locale={koKR}>
      <Result status="info" title="OMS" subTitle="AssetERP 차세대 프로토타입 - 초기 골격" />
    </ConfigProvider>
  );
}
