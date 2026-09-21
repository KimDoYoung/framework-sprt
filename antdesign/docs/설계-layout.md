# 레이아웃의 설계

## 전체적인 레이아웃(layout)

1. TopBar
2. LeftMenuBar
3. StatusBar

위 3개의 구성과 메인 Workspace부분에 tab을 기본으로 각 메뉴 화면을 보여준다.

## 1. TopBar

1. 왼쪽에 logo과 오른쪽에 로그아웃을 비롯한 외부 연계 프로그램의 진입점을 위한 icon메뉴를 갖는다.
2. 화면 번호를 입력하여 workspace에 tab을 호출할 수 있다.
3. tab set과 tab들로 구성된 화면 레이아웃을 이름을 붙여서 저장하고 불러올 수 있는 기능을 갖는다.

## 2. LeftMenuBar

1. 3단계 메뉴를 수용한다
2. 메뉴는 테이블에서 조회를 해서 구성하게 되지만 일단은 화면동작을 위해서 mock data를 이용한다.
3. 1단계 메뉴는 icon과 함께 Text로 표시되며
4. 클릭시 오른쪽 판넬이 toggle로 동작하여 보이고/숨겨진다. 오른쪽판넬 '메뉴23'판녈에 메뉴레벨2와 메뉴레벨3이 보여진다.
5. '모두펼치기','모두접기','고정' 갖고 있다.
6. '고정'은 3단계 메뉴가 클릭되었을 때 '메뉴23'판넬이 숨겨지는가의 여부를 결정한다. 즉 고정이 check된 경우 메뉴23 판넬이 숨겨지지 않는다.

```
<button title="모두 펼치기" class="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-down" aria-hidden="true"><path d="m7 6 5 5 5-5"></path><path d="m7 13 5 5 5-5"></path></svg></button>

<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up" aria-hidden="true"><path d="m17 11-5-5-5 5"></path><path d="m17 18-5-5-5 5"></path></svg>

<button title="사이드바 고정" class="p-1 rounded transition-colors
              text-gray-400 hover:text-gray-600 hover:bg-gray-200"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin-off" aria-hidden="true"><path d="M12 17v5"></path><path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89"></path><path d="m2 2 20 20"></path><path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"></path></svg></button>
              
```

## 3. StatusBar

1. 왼쪽에 시스템 health
2. 오른쪽에 서버 시간에 기초한 시게을 표시한다.
3. 중앙에 시스템으로부터 오는 메세지 또는 동작에 따른 메세지를 표시한다.



