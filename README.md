# 음식점 예약 사이트 제작 프로젝트
## 1. 로그인 화면
![login](https://github.com/meejeei/Restaurant-reservation/assets/133334322/258d9fcd-1c64-454e-b798-5258ba654b83)
### localhost:3000/public/login.html로 점속 시 로그인 화면 출력
<br/><br/>

## 2. 회원가입 
![sign](https://github.com/meejeei/Restaurant-reservation/assets/133334322/d2149faa-58bc-4df4-9fb8-915dc6b3ec1d)
### 계정이 없을 시 회원가입을 통해 계정 생성 
### SQL의 Users 테이블에 바로 아이디, 비밀번호 추가
<br/><br/>

## 3. 음식점 검색
![search1](https://github.com/meejeei/Restaurant-reservation/assets/133334322/56487b9c-3de7-43b0-b907-eb6a9fbaeb1d)
### 음식점 이름 혹은 음식 종류를 선택
<br/><br/>

## 4. 음식점 선택
![res_search1](https://github.com/meejeei/Restaurant-reservation/assets/133334322/50372857-2bdd-45fe-8994-26b45442c9f0)
![res_search2](https://github.com/meejeei/Restaurant-reservation/assets/133334322/23b02567-b433-47ea-b2e1-9dc4903b6220)
### 검색한 음식점 중 한 곳을 선택하여 예약하기 버튼을 클릭
<br/><br/>

## 5. 예약 시간 선택
![res_time](https://github.com/meejeei/Restaurant-reservation/assets/133334322/cfadc767-aebe-4c63-97eb-930ec20be529)
### 해당 음식점의 예약 시간을 선택할 수 있는 화면
### SQL의 예약 정보 저장 테이블 (Table_res)를 통하여 예약 여부 확인 가능
### 해당 시간대의 테이블이 모두 예약 완료 -> 빨강
###                     빈 테이블이 존재 -> 노랑
### 시간 선택 시 테이블 예약 화면으로 이동
<br/><br/>

## 6. 테이블 예약
![res_table](https://github.com/meejeei/Restaurant-reservation/assets/133334322/41bcd4a2-30cc-4e6d-a48c-472e15ee1e82)
### 해당 테이블이 예약 완료 -> 빨강
###            비어 있을 시 -> 노랑
<br/><br/>

## 7. 음식점 위치 확인 
![where1](https://github.com/meejeei/Restaurant-reservation/assets/133334322/a49668a5-f6c6-4883-b296-aeba3d3921a6)
![map](https://github.com/meejeei/Restaurant-reservation/assets/133334322/d6f577b8-bd93-4e5a-bbfa-aa1035a7412e)
### Google API를 활용하여 SQL의 해당 음식점의 위도, 경도를 통하여 위치 확인 가능
