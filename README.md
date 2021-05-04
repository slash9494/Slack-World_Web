# Slack_Web

## 💬 실시간 채팅 웹

> 팀 커뮤니케이션 서비스 Slack을 clone한 그룹단위 및 개별단위의 실시간 대화 웹서비스

![ezgif com-gif-maker_(3)](https://user-images.githubusercontent.com/70849655/117077754-a79f2080-ad73-11eb-8da1-c668bcb78ea8.gif)

![ezgif com-gif-maker_(6)](https://user-images.githubusercontent.com/70849655/117077825-c1406800-ad73-11eb-8817-7467c9c30cbf.gif)

![ezgif com-gif-maker (5)](https://user-images.githubusercontent.com/70849655/117077858-cf8e8400-ad73-11eb-8834-a975a45ecd72.gif)

![_2021-05-05__6 44 54](https://user-images.githubusercontent.com/70849655/117077895-de753680-ad73-11eb-8ca3-e28d0cd5be86.png)

# 📝주요 기능

---

- 오토 스크롤 & 줌 애니메이션
- 리버스 인피니티 스크롤
- 그룹 채팅 & DM 채팅
- 그룹에 사용자 초대
- 채팅에 사용자 맨션
- 실시간 온오프 체크
- 실시간 안 읽은 메세지 표시
- 채팅창에 이미지 업로드
- 반응형 UI

# ⛔에러이슈

---

- 사용자 맨션중 리스트가 포인터 밑에서 나타나는 현상

  맨션의 property중 allowSuggestionsAboveCursor를 true로 적용했음에도 적용이 안됨.

  ⇒ 맨션을 감싸고 있는 컨테이너에 css를 적용하여 에러가 해결

  특별한 위치조정이 없는 css를 적용했는데도 위치가 커서 위쪽으로 가서 이에 대한 컨테이너들의 css를 체크가 필요함.

- 이미지 업로드 에러

  drag & drop을 이용한 이미지 업로드시 dataTransfer의 item과 file에 이미지가 업로드되지 않아 이후 데이터 호출이 진행 되지 않음.

  ⇒ 여러개의 이미지 업로드를 위해 for문으로 배열의 Item을 돌리는 중 업로드한 첫번째 값 이후 두번째 index부터 값이 존재하지 않아 undefined로 인식되면서 생기는 에러

  ⇒ for문으로 돌리지 않는 대신 item의 첫번째 요소만 호출하고, 만약 여러개의 이미지를 업로드해야 한다면 여러번의 이미지 업로드를 호출하느 방식으로 변경

- 모바일 UI에서 drawer 오픈시 채팅 header의 요소들 겹침 현상

  header의 width가 많이 줄어들면서 position이 absolute였던 요소와 기존 요소간의 겹침현상이 발생

  ⇒ position:absolute를 제외하고 기존요소에 min-width를 적용하여 drawer 오픈시 다음 요소들이 옆으로 밀려나도록 수정함.

# 🛠️ 스택

---

- React-typescript
- SWR

  - Why❓

    webSocket을 이용한 실시간의 데이터 전송들이 이루어지는 서비스이므로, 데이터에 대한 최신화와 데이터 전송간의 최적화가 중요하다고 생각하여

    주기적 상태 업데이트, 데이터 캐싱을 이용한 데이터 호출의 특징을 가지고 있는 swr을 채택함

- EmotionJs
- Material-ui
- Mysql
