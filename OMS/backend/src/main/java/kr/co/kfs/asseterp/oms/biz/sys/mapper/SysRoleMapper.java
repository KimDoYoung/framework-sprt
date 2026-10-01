package kr.co.kfs.asseterp.oms.biz.sys.mapper;

import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyRoleRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleByMenuParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleDeleteParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleUserRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleUserSearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysRoleMapper {
    /** 신규 ID (f_create_seq) */
    Long selectNextId();

    RoleRes selectById(Long roleId);

    /** 회사의 권한그룹 중 권한명 LIKE */
    List<RoleRes> searchByName(RoleSearchParam param);

    /** 회사 권한그룹 전체 + 사원 보유 여부 */
    List<RoleUserRes> searchByUserId(RoleUserSearchParam param);

    /** 회사의 권한그룹 중 메뉴 권한(sys07_use_yn)이 있는 것 */
    List<RoleRes> searchByMenuId(RoleByMenuParam param);

    int insert(RoleRow row);

    /** 로그인 회사의 행만 수정된다. 반환: 수정 건수 */
    int update(RoleRow row);

    int delete(RoleDeleteParam param);

    /** 고객사 권한그룹 관리 (기본권한·관리자권한 포함) */
    int insertCompanyRole(CompanyRoleRow row);

    int updateCompanyRole(CompanyRoleRow row);
}
