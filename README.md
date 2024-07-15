# project-devpass-fe

### 사내업무관리 시스템

DEVPASS 는 데이터투테크놀로지의 고객, 영업, 유지보수 데이터를 시스템으로 관리하기 위해 만들어진 사내 업무 관리 시스템입니다.
<br/>
이 저장소는 Frontend Repository 입니다.

🔗 [Data2 Technology | 사내 업무 관리 시스템](http://192.168.1.80:3000/)

## 🛠️ TECH STACKS

DEVPASS 에 사용된 기술스택은 다음과 같습니다.

| 구분                  | 기술                                                        |
| --------------------- | ----------------------------------------------------------- |
| Language & Frameworks | TypeScript, Next.js (12)                                    |
| UI Styling            | Emotion, react-icons                                        |
| State Management      | Recoil                                                      |
| Networking            | GraphQL, graphql-request, react-query                       |
| ETC                   | Hasura, react-hook-form, dayjs, MUI (Material-UI), Chart.js |

## 🏃🏻‍♀️ Getting Started

1. Git Clone

```bash
$ git clone http://192.168.1.206:3000/FE/project-devpass-fe.git
```

<br/>
2. 프로젝트 Root 에 `.env` 을 생성하고 내용을 입력합니다.

<br/>
3. 패키지 매니저를 설치합니다. 이 프로젝트에서는 `yarn` 을 사용하였습니다.

```bash
$ yarn
```

<br/>
4. 프로젝트를 실행합니다.

-   개발 모드로 실행하기

```bash
$ yarn dev
```

-   운영 모드로 실행하기

```bash
# 빌드
$ yarn build

# 실행
$ yarn start
```

## 🤖 Deploy

빌드 & 배포 자동화 Gitea Actions 스크립트를 작성하였습니다.<br/>
📍위치 : `/.gitea/workflows/image.yaml`

project-devpass-fe 는 `v*` 형식의 버전 태그가 붙었을 떄 동작합니다.<br/>
버전 TAG 규칙은 다음과 같습니다.

-   운영 ( main ) : v0.0.0
-   스테이징 ( staging ) : v0.0.0-beta.0
-   개발 ( develop ) : v0.0.0-alpha.0

<br/>
Gitea Actions 는 다음과 같은 흐름으로 실행됩니다.

1.  CheckOut
2.  버전 태그 확인 🔖
3.  버전에 따라 Docker file 경로, Container 이름, Port 지정

    | 운영           |                       |
    | -------------- | --------------------- |
    | Docker file    | dockerfile.prod.yaml  |
    | Container Name | devpass-frontend-prod |
    | Port           | 3000                  |

    | 스테이징       |                          |
    | -------------- | ------------------------ |
    | Docker file    | dockerfile.staging.yaml  |
    | Container Name | devpass-frontend-staging |
    | Port           | 3001                     |

    | 개발           |                      |
    | -------------- | -------------------- |
    | Docker file    | dockerfile.dev.yaml  |
    | Container Name | devpass-frontend-dev |
    | Port           | 3002                 |

4.  Docker Login 🐳
5.  Docker Image Build & Deploy 🐳
6.  Docker Container 중지 및 삭제
7.  Docker Container 재실행

## 🍀 Codegen

Codegen은 미리 정의된 템플릿과 설정을 기반으로 코드를 생성하는 도구입니다.<br/>
설정 파일은 /codegen.yaml에 위치해 있습니다.<br/>
Codegen 이 바라보고 있는 Endpoint 를 잘 확인해주세요!

```bash
$ yarn codegen
```
