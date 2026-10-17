/** I/F 설정 한 행 (AS-IS Ifi90_ConfigModel). 신규 행의 configId는 0 이하 임시 값 */
export interface IfiConfig {
  configId: number;
  ifCode?: string | null;
  ifName?: string | null;
  ifType?: string | null;
  ifTypeName?: string | null;
  localHost?: string | null;
  localPort?: string | null;
  localAccount?: string | null;
  localPwDec?: string | null;
  localPath?: string | null;
  localKey?: string | null;
  targetHost?: string | null;
  targetPort?: string | null;
  targetAccount?: string | null;
  targetPwDec?: string | null;
  targetPath?: string | null;
  targetKey?: string | null;
  note?: string | null;
}
