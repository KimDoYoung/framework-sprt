package kr.co.kfs.asseterp.oms.biz.sys.mapper;

import kr.co.kfs.asseterp.oms.biz.sys.dto.PasswordParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.PasswordPersonRes;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** 비밀번호 sys25_password (AS-IS sys25_password 매퍼 + emp03_trans.selectByPasswordPersonId) */
@Mapper
public interface SysPasswordMapper {
    /** 회사의 현재 재직 사원 (personId가 있으면 그 사원만) */
    List<PasswordPersonRes> searchPersons(PasswordParam param);

    /** 사원의 회사 ID (없으면 null) */
    Long selectPersonCompanyId(Long personId);

    /** 사원의 최근 비밀번호 순번 (없으면 null) */
    Long selectLastSeq(PasswordParam param);

    int insert(PasswordParam param);

    int updatePassword(PasswordParam param);
}
