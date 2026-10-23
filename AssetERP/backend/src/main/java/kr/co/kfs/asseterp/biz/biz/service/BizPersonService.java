package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizPersonRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizPersonMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS Biz02_Grid_InternalList·Biz02_Grid_ExternalList → server/biz/Biz02_Person.java (selectByInternal L26 / selectByExternal L32 / insertEmpId L59 / modelUpdate L99 / delete L118) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizPersonService {

    private final BizPersonMapper mapper;

    public List<BizPersonRes> searchInternal(UserPrincipal user, Long promoId) {
        return mapper.selectByInternal(user.getCompanyId(), promoId);
    }

    public List<BizPersonRes> searchExternal(UserPrincipal user, Long promoId) {
        return mapper.selectByExternal(user.getCompanyId(), promoId);
    }

    /** AS-IS modelUpdate(직원 한 행: promoId·empYn=true·empId, personId는 새로 채번) — 고른 직원마다. 추가한 건수 */
    @Transactional
    public int addEmps(UserPrincipal user, Long promoId, List<Long> empIds) {
        if (mapper.countPromo(user.getCompanyId(), promoId) == 0) {
            return 0;
        }
        for (Long empId : empIds) {
            mapper.insertEmp(mapper.selectNextId(), promoId, empId);
        }
        return empIds.size();
    }

    /** AS-IS insertEmpId — 고른 내역마다 로그인 사원이 아직 없으면 직원으로 넣는다 */
    @Transactional
    public int autoRegister(UserPrincipal user, List<Long> promoIds) {
        int count = 0;
        for (Long promoId : promoIds) {
            if (mapper.countPromo(user.getCompanyId(), promoId) == 0) {
                continue;
            }
            if (mapper.countByEmpId(promoId, user.getUserId()) == 0) {
                mapper.insertEmp(mapper.selectNextId(), promoId, user.getUserId());
                count++;
            }
        }
        return count;
    }

    /** AS-IS Biz04_ProvideSetup.selectByProvideContentCode — 설정이 없거나 비어 있으면 false */
    public boolean getEmpSetYn(UserPrincipal user, String provideContentCode) {
        return "true".equals(mapper.selectEmpSetYn(user.getCompanyId(), provideContentCode));
    }

    /** AS-IS delete → UpdateDataModel.deleteModel. 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> personIds) {
        return personIds.stream().mapToInt(id -> mapper.deleteById(user.getCompanyId(), id)).sum();
    }
}
