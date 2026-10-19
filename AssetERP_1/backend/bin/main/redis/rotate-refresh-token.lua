-- Refresh Token 교체(rotation) 및 재사용 탐지 (원자적 처리)
-- KEYS[1] 활성 jti 키 / KEYS[2] 현재 rid 키 / KEYS[3] 직전 rid 키
-- ARGV[1] 요청 jti / ARGV[2] 요청 rid / ARGV[3] 새 rid / ARGV[4] 세션 TTL(ms) / ARGV[5] 유예시간(ms)
-- 반환: NOT_FOUND | MISMATCH | REUSED | ROTATED:<새 rid> | GRACE:<현재 rid>

local activeJti = redis.call('GET', KEYS[1])
if not activeJti then
  return 'NOT_FOUND'
end
if activeJti ~= ARGV[1] then
  return 'MISMATCH'
end

local currentRid = redis.call('GET', KEYS[2])
if not currentRid then
  return 'NOT_FOUND'
end

-- 1. 현재 토큰: 새 rid로 교체하고, 직전 rid는 유예시간 동안만 보관
if currentRid == ARGV[2] then
  redis.call('SET', KEYS[3], ARGV[2], 'PX', ARGV[5])
  redis.call('SET', KEYS[2], ARGV[3], 'PX', ARGV[4])
  redis.call('PEXPIRE', KEYS[1], ARGV[4])
  return 'ROTATED:' .. ARGV[3]
end

-- 2. 직전 토큰 + 유예시간 이내: 동시 갱신으로 보고 현재 rid로 재발급 (교체하지 않음)
if redis.call('GET', KEYS[3]) == ARGV[2] then
  redis.call('PEXPIRE', KEYS[1], ARGV[4])
  redis.call('PEXPIRE', KEYS[2], ARGV[4])
  return 'GRACE:' .. currentRid
end

-- 3. 이미 교체된 토큰의 재사용: 탈취 의심 → 세션 전체 폐기
redis.call('DEL', KEYS[1], KEYS[2], KEYS[3])
return 'REUSED'
