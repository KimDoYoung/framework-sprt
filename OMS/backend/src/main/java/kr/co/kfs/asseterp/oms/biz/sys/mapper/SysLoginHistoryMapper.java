package kr.co.kfs.asseterp.oms.biz.sys.mapper;

import kr.co.kfs.asseterp.oms.biz.sys.dto.LoginHistoryRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.LoginHistorySearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** 로그인내역 sys26_login 조회 (AS-IS sys26_login 매퍼. 기록은 biz.auth LoginHistoryMapper가 남긴다) */
@Mapper
public interface SysLoginHistoryMapper {
    List<LoginHistoryRes> searchByLoginDate(LoginHistorySearchParam param);
}
